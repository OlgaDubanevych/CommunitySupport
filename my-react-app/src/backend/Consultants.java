package backend;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Consultants {

    private static final List<Consultant> consultants = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/consultants", new ConsultantsHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class ConsultantsHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, -1);
                return;
            }

            if ("DELETE".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/consultants/\\d+")) {
                    String consultantId = path.replaceAll("/api/consultants/(\\d+)", "$1");
                    handleDeleteRequest(exchange, consultantId);
                } else {
                    sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid DELETE request");
                }
            } else if ("POST".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();

                if ("/api/consultants".equals(path)) {
                    handlePostRequest(exchange);
                } else if (path.matches("/api/consultants/\\d+/message")) {
                    handleConsultantMessagePostRequest(exchange);
                } else {
                    sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not Found");
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_METHOD, "Method Not Allowed");
            }
        }

        private void handleDeleteRequest(HttpExchange exchange, String consultantId) throws IOException {
            Consultant consultant = findConsultantById(Integer.parseInt(consultantId));
            if (consultant != null) {
                consultants.remove(consultant);
                sendResponse(exchange, HttpURLConnection.HTTP_OK, convertConsultantsToJson());
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Consultant not found");
            }
        }


        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern firstNamePattern = Pattern.compile("\"firstName\":\"(.*?)\"");
            Pattern lastNamePattern = Pattern.compile("\"lastName\":\"(.*?)\"");
            Pattern organizationPattern = Pattern.compile("\"organization\":\"(.*?)\"");
            Pattern emailPattern = Pattern.compile("\"email\":\"(.*?)\"");
            Pattern phonePattern = Pattern.compile("\"phone\":\"(.*?)\"");
            Pattern competitiveAdvantagePattern = Pattern.compile("\"competitiveAdvantage\":\"(.*?)\"");

            Matcher firstNameMatcher = firstNamePattern.matcher(requestBody);
            Matcher lastNameMatcher = lastNamePattern.matcher(requestBody);
            Matcher organizationMatcher = organizationPattern.matcher(requestBody);
            Matcher emailMatcher = emailPattern.matcher(requestBody);
            Matcher phoneMatcher = phonePattern.matcher(requestBody);
            Matcher competitiveAdvantageMatcher = competitiveAdvantagePattern.matcher(requestBody);

            if (firstNameMatcher.find() && lastNameMatcher.find() && organizationMatcher.find() &&
                    emailMatcher.find() && phoneMatcher.find() && competitiveAdvantageMatcher.find()) {
                String firstName = firstNameMatcher.group(1);
                String lastName = lastNameMatcher.group(1);
                String organization = organizationMatcher.group(1);
                String email = emailMatcher.group(1);
                String phone = phoneMatcher.group(1);
                String competitiveAdvantage = competitiveAdvantageMatcher.group(1);

                Consultant newConsultant = new Consultant(firstName, lastName, organization, email, phone, competitiveAdvantage);

                consultants.add(newConsultant);
                sendResponse(exchange, HttpURLConnection.HTTP_OK, convertConsultantsToJson());
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid JSON format");
            }
        }

        private void handleConsultantMessagePostRequest(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
            if (pathSegments.length != 5) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid URL");
                return;
            }

            try {
                int consultantId = Integer.parseInt(pathSegments[4]);
                handleConsultantMessage(exchange, consultantId);
            } catch (NumberFormatException e) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid consultant ID");
            }
        }

        private void handleConsultantMessage(HttpExchange exchange, int consultantId) throws IOException {
            Consultant consultant = findConsultantById(consultantId);
            if (consultant != null) {
                String requestBody = new String(exchange.getRequestBody().readAllBytes());
                System.out.println("Received message request for consultant ID: " + consultantId);
                System.out.println("Request body: " + requestBody);

                // Extract the consultant's email
                Map<String, String> jsonMap = parseJson(requestBody);
                String consultantEmail = jsonMap.get("email");
                System.out.println("Consultant email: " + consultantEmail);

                // Simulating sending an email (replace this with your actual logic)
                sendEmailToConsultant(consultantEmail, "Your message has been received");

                // Send a response
                sendResponse(exchange, HttpURLConnection.HTTP_OK, "Message received for consultant ID: " + consultantId);
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Consultant not found");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, HttpURLConnection.HTTP_OK, convertConsultantsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String convertConsultantsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (Consultant consultant : consultants) {
                json.append(consultant.toJson()).append(",");
            }
            if (!consultants.isEmpty()) {
                json.setLength(json.length() - 1);
            }
            json.append("]");
            return json.toString();
        }

        private Consultant findConsultantById(int consultantId) {
            for (Consultant consultant : consultants) {
                if (consultant.getId().equals(String.valueOf(consultantId))) {
                    return consultant;
                }
            }
            return null;
        }

        private static Map<String, String> parseJson(String json) {
            Map<String, String> resultMap = new HashMap<>();
            String[] keyValuePairs = json.substring(1, json.length() - 1).split(",");
            for (String pair : keyValuePairs) {
                String[] entry = pair.split(":");
                String key = entry[0].trim().replace("\"", "");
                String value = entry[1].trim().replace("\"", "");
                resultMap.put(key, value);
            }
            return resultMap;
        }
    }

    private static class Consultant {
        private String id;
        private String firstName;
        private String lastName;
        private String organization;
        private String email;
        private String phone;
        private String competitiveAdvantage;

        public Consultant(String firstName, String lastName, String organization, String email, String phone, String competitiveAdvantage) {
            this.id = String.valueOf(consultants.size() + 1);
            this.firstName = firstName;
            this.lastName = lastName;
            this.organization = organization;
            this.email = email;
            this.phone = phone;
            this.competitiveAdvantage = competitiveAdvantage;
        }

        public String getId() {
            return id;
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"organization\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\",\"competitiveAdvantage\":\"%s\"}",
                    id, firstName, lastName, organization, email, phone, competitiveAdvantage);
        }
    }

    // Simulated method to send an email (replace this with your actual email logic)
    private static void sendEmailToConsultant(String email, String message) {
        System.out.println("Email sent to " + email + ": " + message);
    }
}