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

public class Jobs {
    private static final List<JobPost> jobPosts = new ArrayList<>();
    private static int jobIdCounter = 1;

    public static class JobsHandler implements HttpHandler {
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
                String path = exchange.getRequestURI().getPath();

                // Check if the request is for posting a job
                if ("/api/jobs".equals(path)) {
                    handlePostRequest(exchange);
                } else {
                    sendResponse(exchange, 404, "Not Found");
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Use regex to extract job post properties
            Pattern datePattern = Pattern.compile("\"jobPostingDate\":\"(.*?)\"");
            Pattern descriptionPattern = Pattern.compile("\"jobDescription\":\"(.*?)\"");
            Matcher dateMatcher = datePattern.matcher(requestBody);
            Matcher descriptionMatcher = descriptionPattern.matcher(requestBody);

            if (dateMatcher.find() && descriptionMatcher.find()) {
                String jobPostingDate = dateMatcher.group(1);
                String jobDescription = descriptionMatcher.group(1);

                JobPost newJobPost = new JobPost(String.valueOf(jobIdCounter++), jobPostingDate, jobDescription);

                jobPosts.add(newJobPost);
                sendResponse(exchange, 200, convertJobPostsToJson());
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, 200, convertJobPostsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        private String convertJobPostsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (JobPost jobPost : jobPosts) {
                json.append(jobPost.toJson()).append(",");
            }
            if (!jobPosts.isEmpty()) {
                json.setLength(json.length() - 1);
            }
            json.append("]");

            return json.toString();
        }
    }

    private static class JobPost {
        private String id;
        private String jobPostingDate;
        private String jobDescription;

        public JobPost(String id, String jobPostingDate, String jobDescription) {
            this.id = id;
            this.jobPostingDate = jobPostingDate;
            this.jobDescription = jobDescription;
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"jobPostingDate\":\"%s\",\"jobDescription\":\"%s\"}", id, jobPostingDate, jobDescription);
        }
    }
}
