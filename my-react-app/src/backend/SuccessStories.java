package backend;

import com.sun.net.httpserver.Headers;
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

public class SuccessStories {

    private static final List<SuccessStory> successStories = new ArrayList<>();
    private static int storyIdCounter = 1;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/stories", new StoriesHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class StoriesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Enable CORS
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                // For preflight requests, respond successfully
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("DELETE".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/stories/\\d+")) {
                    String storyId = path.replaceAll("/api/stories/(\\d+)", "$1");
                    handleDeleteRequest(exchange, storyId);
                } else {
                    sendResponse(exchange, 400, "Invalid DELETE request");
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                handlePostRequest(exchange);
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }

        private void handleDeleteRequest(HttpExchange exchange, String storyId) throws IOException {
            SuccessStory story = findStoryById(storyId);
            if (story != null) {
                successStories.remove(story);
                sendResponse(exchange, 200, convertStoriesToJson());
            } else {
                sendResponse(exchange, 404, "Story not found");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Use regex to extract success story properties
            Pattern firstNamePattern = Pattern.compile("\"firstName\":\"(.*?)\"");
            Pattern lastNamePattern = Pattern.compile("\"lastName\":\"(.*?)\"");
            Pattern emailPattern = Pattern.compile("\"email\":\"(.*?)\"");
            Pattern storyPattern = Pattern.compile("\"story\":\"(.*?)\"");

            Matcher firstNameMatcher = firstNamePattern.matcher(requestBody);
            Matcher lastNameMatcher = lastNamePattern.matcher(requestBody);
            Matcher emailMatcher = emailPattern.matcher(requestBody);
            Matcher storyMatcher = storyPattern.matcher(requestBody);

            if (firstNameMatcher.find() && lastNameMatcher.find() && emailMatcher.find() && storyMatcher.find()) {
                String firstName = firstNameMatcher.group(1);
                String lastName = lastNameMatcher.group(1);
                String email = emailMatcher.group(1);
                String story = storyMatcher.group(1);

                SuccessStory newSuccessStory = new SuccessStory(String.valueOf(storyIdCounter++), firstName, lastName, email, story);

                successStories.add(newSuccessStory);
                sendResponse(exchange, 200, convertStoriesToJson());
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            // Send back the list of all success stories
            sendResponse(exchange, 200, convertStoriesToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String convertStoriesToJson() {
            // Convert the list of success stories to JSON-like format
            StringBuilder json = new StringBuilder("[");
            for (SuccessStory successStory : successStories) {
                json.append(successStory.toJson()).append(",");
            }
            if (!successStories.isEmpty()) {
                json.setLength(json.length() - 1); // Remove the trailing comma
            }
            json.append("]");

            return json.toString();
        }

        private SuccessStory findStoryById(String storyId) {
            for (SuccessStory story : successStories) {
                if (story.getId().equals(storyId)) {
                    return story;
                }
            }
            return null;
        }
    }

    private static class SuccessStory {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String story;

        public SuccessStory(String id, String firstName, String lastName, String email, String story) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.story = story;
        }

        public String getId() {
            return id;
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"email\":\"%s\",\"story\":\"%s\"}", id, firstName, lastName, email, story);
        }
    }
}
