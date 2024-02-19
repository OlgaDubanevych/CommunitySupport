package backend;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Questions {
    private static final List<Question> questions = new ArrayList<>();
    private static int questionIdCounter = 2;
    static {
        Question initialQuestion = new Question(
                "1",
                "My husband, our 2-year-old daughter and I are planning to come to Canada using a CUAET Visa (Canada-Ukraine authorization for emergency travel). Does someone have experience applying for this program or know people who used it? Are there any tips regarding the application process, and what to do before and after arriving in Canada? Do you know any immigration consultants who might help? What were your experiences of being a newcomer with little children?",
                QuestionCategory.IMMIGRATION,
                false
        );
        initialQuestion.addComment("One of my friends actually used CUAET. She is already in Canada. Her contact details: a.alladina@gmail.com, (613) 208 - 58374. I'm sure she would be happy to answer your questions!");
        initialQuestion.addComment("I have helped many clients come to Canada by applying through CUAET. Would be happy to provide my consultation: (416) 574 8294, matthew.chau@gmail.com");
        questions.add(initialQuestion);
    }
    
    public static class QuestionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
        
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }
        
            if ("DELETE".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/questions/\\d+")) {
                    String questionId = path.replaceAll("/api/questions/(\\d+)", "$1");
                    handleDeleteRequest(exchange, questionId);
                } else {
                    sendResponse(exchange, 400, "Invalid DELETE request");
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/questions/\\d+/comments")) {
                    String questionId = path.replaceAll("/api/questions/(\\d+)/comments", "$1");
                    handleCommentPostRequest(exchange, questionId);
                } else if (path.matches("/api/questions/likes/\\d+")) {
                    String questionId = path.replaceAll("/api/questions/likes/(\\d+)", "$1");
                    handleLikePostRequest(exchange, questionId);
                } else {
                    handlePostRequest(exchange);
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
        
        private void handleDeleteRequest(HttpExchange exchange, String questionId) throws IOException {
            Question question = findQuestionById(questionId);
            if (question != null) {
                questions.remove(question);
                sendResponse(exchange, 200, convertQuestionsToJson());
            } else {
                sendResponse(exchange, 404, "Question not found");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern textPattern = Pattern.compile("\"text\":\"(.*?)\"");
            Pattern categoryPattern = Pattern.compile("\"category\":\"(.*?)\"");
            Pattern commentPattern = Pattern.compile("\"comment\":\"(.*?)\"");
            Matcher textMatcher = textPattern.matcher(requestBody);
            Matcher commentMatcher = commentPattern.matcher(requestBody);
            Matcher categoryMatcher = categoryPattern.matcher(requestBody);

            if (textMatcher.find() && categoryMatcher.find()) {
                String text = textMatcher.group(1);
                String categoryString = categoryMatcher.group(1);
                QuestionCategory category = QuestionCategory.valueOf(categoryString.toUpperCase());

                String comment = commentMatcher.find() ? commentMatcher.group(1) : "";

                Question newQuestion = new Question(String.valueOf(questionIdCounter++), text, category, false);

                if (!comment.isEmpty()) {
                    newQuestion.addComment(comment);
                }

                questions.add(newQuestion);

                sendResponse(exchange, 200, convertQuestionsToJson());
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleCommentPostRequest(HttpExchange exchange, String questionId) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern commentPattern = Pattern.compile("\"comment\":\"(.*?)\"");
            Matcher commentMatcher = commentPattern.matcher(requestBody);

            if (commentMatcher.find()) {
                String comment = commentMatcher.group(1);

                Question question = findQuestionById(questionId);
                if (question != null) {
                    question.addComment(comment);
                    sendResponse(exchange, 200, convertQuestionsToJson());
                } else {
                    sendResponse(exchange, 404, "Question not found");
                }
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleLikePostRequest(HttpExchange exchange, String questionId) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern likedPattern = Pattern.compile("\"liked\":(true|false)");
            Matcher likedMatcher = likedPattern.matcher(requestBody);

            if (likedMatcher.find()) {
                boolean liked = Boolean.parseBoolean(likedMatcher.group(1));

                Question question = findQuestionById(questionId);
                if (question != null) {
                    question.setLiked(liked);

                    if (liked) {
                        question.setLikes(question.getLikes() + 1);
                    } else {
                        question.setLikes(question.getLikes() - 1);
                    }

                    sendResponse(exchange, 200, convertQuestionsToJson());
                } else {
                    sendResponse(exchange, 404, "Question not found");
                }
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, 200, convertQuestionsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        private String convertQuestionsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (Question question : questions) {
                json.append("{\"id\":\"").append(question.getId())
                        .append("\",\"text\":\"").append(question.getText())
                        .append("\",\"liked\":").append(question.isLiked())
                        .append(",\"likes\":").append(question.getLikes())
                        .append(",\"category\":\"").append(question.getCategory())
                        .append("\",\"comments\":").append(convertCommentsToJson(question.getComments()))
                        .append("},");
            }
            if (!questions.isEmpty()) {
                json.setLength(json.length() - 1);
            }
            json.append("]");

            return json.toString();
        }

        private String convertCommentsToJson(List<String> comments) {
            StringBuilder json = new StringBuilder("[");
            for (String comment : comments) {
                json.append("\"").append(comment).append("\",");
            }
            if (!comments.isEmpty()) {
                json.setLength(json.length() - 1); 
            }
            json.append("]");

            return json.toString();
        }

        private Question findQuestionById(String questionId) {
            for (Question question : questions) {
                if (question.getId().equals(questionId)) {
                    return question;
                }
            }
            return null;
        }
    }

    public static class Question {
        private String id;
        private String text;
        private boolean liked;
        private int likes = 0;
        private List<String> comments = new ArrayList<>();
        private QuestionCategory category; 

        public Question(String id, String text, QuestionCategory category, boolean liked) {
            this.id = id;
            this.text = text;
            this.liked = liked;
            this.category = category;
        }

        public String getId() {
            return id;
        }

        public String getText() {
            return text;
        }

        public boolean isLiked() {
            return liked;
        }

        public int getLikes() {
            return likes;
        }

        public QuestionCategory getCategory() {
            return category;
        }

        public void setLiked(boolean liked) {
            this.liked = liked;
        }

        public void setLikes(int likes) {
            this.likes = likes;
        }

        public List<String> getComments() {
            return comments;
        }

        public void addComment(String comment) {
            comments.add(comment);
        }
    }

    public enum QuestionCategory {
        JOB_SEARCH,
        IMMIGRATION,
        EDUCATION_COLLEGE_UNIVERSITY,
        EDUCATION_HIGH_SCHOOL_DAYCARE,
        HEALTHCARE,
        FAMILY_RELATIONSHIPS,
        REAL_ESTATE,
        ENTERTAINMENT,
        OTHER
    }
    
}