package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class JobApplication {

    private static final List<JobApplicationData> jobApplications = new ArrayList<>();
    private static int applicationIdCounter = 1;

    public static class ApplicationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Enable CORS
            enableCORS(exchange);

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                // For preflight requests, respond successfully
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                handlePostRequest(exchange);
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            // Assuming the JSON structure for a job application
            // Modify this based on the actual structure of your application form
            // (code omitted for brevity)

            // You can save the application details, send emails, etc.
            // For this example, we'll just add the application to the list
            jobApplications.add(new JobApplicationData(String.valueOf(applicationIdCounter++), requestBody));

            sendResponse(exchange, 200, "Application submitted successfully!");
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, 200, convertApplicationsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        private String convertApplicationsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (JobApplicationData application : jobApplications) {
                json.append(application.toJson()).append(",");
            }
            if (!jobApplications.isEmpty()) {
                json.setLength(json.length() - 1);
            }
            json.append("]");

            return json.toString();
        }

        private void enableCORS(HttpExchange exchange) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
        }
    }

    private static class JobApplicationData {
        private String id;
        private String data; // This could be the entire application form data

        public JobApplicationData(String id, String data) {
            this.id = id;
            this.data = data;
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"data\":\"%s\"}", id, data);
        }
    }
}
