package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.Headers;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Consultants {

    private static final List<Consultant> consultants = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        com.sun.net.httpserver.HttpServer server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(7000), 0);
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
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();

                if ("/api/consultants".equals(path)) {
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

            // Use regex to extract consultant properties
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
                sendResponse(exchange, 200, convertConsultantsToJson());
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, 200, convertConsultantsToJson());
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
    }

    private static class Consultant {
        private String firstName;
        private String lastName;
        private String organization;
        private String email;
        private String phone;
        private String competitiveAdvantage;

        public Consultant(String firstName, String lastName, String organization, String email, String phone, String competitiveAdvantage) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.organization = organization;
            this.email = email;
            this.phone = phone;
            this.competitiveAdvantage = competitiveAdvantage;
        }

        public String toJson() {
            return String.format("{\"firstName\":\"%s\",\"lastName\":\"%s\",\"organization\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\",\"competitiveAdvantage\":\"%s\"}",
                    firstName, lastName, organization, email, phone, competitiveAdvantage);
        }
    }
}
