package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.LinkedHashMap;

public class JobApplication {

    private static final List<Map<String, String>> jobApplications = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        com.sun.net.httpserver.HttpServer server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/applications", new ApplicationsHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class ApplicationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCORS(exchange);

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
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

            Map<String, String> applicationData = new HashMap<>();
            applicationData.put("jobTitle", extractValue(requestBody, "jobTitle"));
            applicationData.put("firstName", extractValue(requestBody, "firstName"));
            applicationData.put("lastName", extractValue(requestBody, "lastName"));
            applicationData.put("email", extractValue(requestBody, "email"));
            applicationData.put("phone", extractValue(requestBody, "phone"));
            applicationData.put("resume", extractValue(requestBody, "resume"));
            applicationData.put("coverLetter", extractValue(requestBody, "coverLetter"));

            jobApplications.add(applicationData);

            sendResponse(exchange, 200, "Application submitted successfully!");
        }

        private String extractValue(String requestBody, String key) {
            Pattern pattern = Pattern.compile("\"" + key + "\":\"(.*?)\"");
            Matcher matcher = pattern.matcher(requestBody);
            return matcher.find() ? matcher.group(1) : "";
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, 200, convertApplicationsToJson());
        }

        private void enableCORS(HttpExchange exchange) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String convertApplicationsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (Map<String, String> application : jobApplications) {
                String[] orderedProperties = {"jobTitle", "firstName", "lastName", "email", "phone", "resume", "coverLetter"};

                Map<String, String> orderedApplication = new LinkedHashMap<>();
                for (String property : orderedProperties) {
                    orderedApplication.put(property, application.get(property));
                }

                json.append("{");
                for (Map.Entry<String, String> entry : orderedApplication.entrySet()) {
                    json.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\",");
                }
                json.setLength(json.length() - 1); 
                json.append("},");
            }
            if (!jobApplications.isEmpty()) {
                json.setLength(json.length() - 1); 
            }
            json.append("]");

            return json.toString();
        }

    }
}
