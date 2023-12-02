/*import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JavaBackend {
    private static final List<Question> questions = new ArrayList<>();
    private static int questionIdCounter = 1;

    public static void main(String[] args) {
        try {
            // Create a simple HTTP server on port 7000
            HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);

            // Create a context for the '/api/questions' endpoint
            server.createContext("/api/questions", new QuestionsHandler());

            // Start the server
            server.start();
            System.out.println("Server is running on port 7000");
        } catch (IOException e) {
            System.err.println("Error starting the server: " + e.getMessage());
        }
    }

    static class QuestionsHandler implements HttpHandler {
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
                // Check if the request is for posting a question or a comment
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/questions/\\d+/comments")) {
                    // Extract question ID from the path
                    String questionId = path.replaceAll("/api/questions/(\\d+)/comments", "$1");
                    handleCommentPostRequest(exchange, questionId);
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

            // Use regex to extract the text and comment properties
            Pattern textPattern = Pattern.compile("\"text\":\"(.*?)\"");
            Pattern commentPattern = Pattern.compile("\"comment\":\"(.*?)\"");
            Matcher textMatcher = textPattern.matcher(requestBody);
            Matcher commentMatcher = commentPattern.matcher(requestBody);

            if (textMatcher.find()) {
                String text = textMatcher.group(1);
                String comment = commentMatcher.find() ? commentMatcher.group(1) : "";

                // Create a new question with the provided text and comment
                Question newQuestion = new Question(String.valueOf(questionIdCounter++), text, comment);
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
                        .append("\",\"comment\":\"").append(question.getComment())
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

    static class Question {
        private String id;
        private String text;
        private String comment;
        private List<String> comments = new ArrayList<>();

        public Question(String id, String text, String comment) {
            this.id = id;
            this.text = text;
            this.comment = comment;
        }

        public String getId() {
            return id;
        }

        public String getText() {
            return text;
        }

        public String getComment() {
            return comment;
        }

        public List<String> getComments() {
            return comments;
        }

        public void addComment(String comment) {
            comments.add(comment);
        }
    }
}
*/

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.InetSocketAddress;

public class JavaBackend {
    private static final Logger logger = Logger.getLogger(JavaBackend.class.getName());

    public static void main(String[] args) {
        try {
            // Configure the logger
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(Level.ALL);
            logger.addHandler(consoleHandler);
            logger.setLevel(Level.ALL);

            // Create a simple HTTP server on port 7000
            HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);

            // Create a context for the '/api/questions' endpoint
            server.createContext("/api/questions", new Questions.QuestionsHandler());

            // Start the server
            server.start();
            logger.info("Server is running on port 7000");
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error starting the server", e);
        }
    }
}
