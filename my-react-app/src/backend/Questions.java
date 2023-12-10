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
    private static int questionIdCounter = 1;

    public static class QuestionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Enable CORS
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                // For preflight requests, respond successfully
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                // Check if the request is for posting a question, a comment, or updating likes
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/questions/\\d+/comments")) {
                    // Extract question ID from the path
                    String questionId = path.replaceAll("/api/questions/(\\d+)/comments", "$1");
                    handleCommentPostRequest(exchange, questionId);
                } else if (path.matches("/api/questions/likes/\\d+")) {
                    // Extract question ID from the path
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

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            // Read the request body
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Use regex to extract the text, category, and comment properties
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

                // Create a new question with the provided text, category, and comment
                Question newQuestion = new Question(String.valueOf(questionIdCounter++), text, category, false);

                // Add the comment only if it is present
                if (!comment.isEmpty()) {
                    newQuestion.addComment(comment);
                }

                questions.add(newQuestion);

                // Send back the updated list of questions
                sendResponse(exchange, 200, convertQuestionsToJson());
            } else {
                // Handle regex match failure
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleCommentPostRequest(HttpExchange exchange, String questionId) throws IOException {
            // Read the request body
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Use regex to extract the comment property
            Pattern commentPattern = Pattern.compile("\"comment\":\"(.*?)\"");
            Matcher commentMatcher = commentPattern.matcher(requestBody);

            if (commentMatcher.find()) {
                String comment = commentMatcher.group(1);

                // Find the question with the specified ID
                Question question = findQuestionById(questionId);
                if (question != null) {
                    // Add the comment to the question
                    question.addComment(comment);

                    // Send back the updated list of questions
                    sendResponse(exchange, 200, convertQuestionsToJson());
                } else {
                    // Handle question not found
                    sendResponse(exchange, 404, "Question not found");
                }
            } else {
                // Handle regex match failure
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleLikePostRequest(HttpExchange exchange, String questionId) throws IOException {
            // Read the request body
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Use regex to extract the liked property
            Pattern likedPattern = Pattern.compile("\"liked\":(true|false)");
            Matcher likedMatcher = likedPattern.matcher(requestBody);

            if (likedMatcher.find()) {
                boolean liked = Boolean.parseBoolean(likedMatcher.group(1));

                // Find the question with the specified ID
                Question question = findQuestionById(questionId);
                if (question != null) {
                    // Update the like status of the question
                    question.setLiked(liked);

                    // Update the likes count
                    if (liked) {
                        question.setLikes(question.getLikes() + 1);
                    } else {
                        question.setLikes(question.getLikes() - 1);
                    }

                    // Send back the updated list of questions
                    sendResponse(exchange, 200, convertQuestionsToJson());
                } else {
                    // Handle question not found
                    sendResponse(exchange, 404, "Question not found");
                }
            } else {
                // Handle regex match failure
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            // Send back the list of questions
            sendResponse(exchange, 200, convertQuestionsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        private String convertQuestionsToJson() {
            // Convert questions list to JSON
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
                json.setLength(json.length() - 1); // Remove the trailing comma
            }
            json.append("]");

            return json.toString();
        }

        private String convertCommentsToJson(List<String> comments) {
            // Convert comments list to JSON
            StringBuilder json = new StringBuilder("[");
            for (String comment : comments) {
                json.append("\"").append(comment).append("\",");
            }
            if (!comments.isEmpty()) {
                json.setLength(json.length() - 1); // Remove the trailing comma
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
        private QuestionCategory category; // Use the enum for category

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
