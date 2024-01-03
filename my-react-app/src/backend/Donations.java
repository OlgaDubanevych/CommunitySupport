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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Donations {

    private static final List<Donation> donations = new ArrayList<>();
    private static int donationIdCounter = 1;

    public enum Category {
        CLOTHING,
        ELECTRONICS,
        FURNITURE,
        BOOKS,
        OTHER
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/donations", new DonationsHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class DonationsHandler implements HttpHandler {
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

            if ("POST".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();

                if ("/api/donations".equals(path)) {
                    handlePostRequest(exchange);

                } else if (path.matches("/api/donations/\\d+/recommend")) {
                    handleRecommendationPostRequest(exchange);
                } else if (path.matches("/api/donations/\\d+/message")) {
                    handleMessagePostRequest(exchange);
                } else {
                    sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not Found");
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_METHOD, "Method Not Allowed");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern itemNamePattern = Pattern.compile("\"itemName\":\"(.*?)\"");
            Pattern itemDescriptionPattern = Pattern.compile("\"itemDescription\":\"(.*?)\"");

            Pattern recommendPattern = Pattern.compile("\"recommend\":(true|false)");
            Pattern categoryPattern = Pattern.compile("\"category\":\"(.*?)\"");
            Pattern emailPattern = Pattern.compile("\"email\":\"(.*?)\"");

            Matcher categoryMatcher = categoryPattern.matcher(requestBody);
            Matcher emailMatcher = emailPattern.matcher(requestBody);

            String categoryString = null;
            if (categoryMatcher.find()) {
                categoryString = categoryMatcher.group(1);
            }

            String email = null;
            if (emailMatcher.find()) {
                email = emailMatcher.group(1);
            }

            Category category = Category.OTHER;
            if (categoryString != null) {
                try {
                    category = Category.valueOf(categoryString.toUpperCase());
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid category received: " + categoryString);
                }
            }

            Matcher itemNameMatcher = itemNamePattern.matcher(requestBody);
            Matcher itemDescriptionMatcher = itemDescriptionPattern.matcher(requestBody);
            Matcher recommendMatcher = recommendPattern.matcher(requestBody);

            if (categoryString != null && itemNameMatcher.find() && itemDescriptionMatcher.find()) {
                String itemName = itemNameMatcher.group(1);
                String itemDescription = itemDescriptionMatcher.group(1);

                Donation newDonation = new Donation(String.valueOf(donationIdCounter++), itemName, itemDescription, category, email);

                if (recommendMatcher.find()) {
                    boolean recommended = Boolean.parseBoolean(recommendMatcher.group(1));
                    newDonation.setRecommended(recommended);
                }

                donations.add(newDonation);
                String jsonResponse = convertDonationsToJson();
                sendResponse(exchange, HttpURLConnection.HTTP_OK, jsonResponse);
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid JSON format");
            }
        }

        private void handleRecommendationPostRequest(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
            if (pathSegments.length != 4) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid URL");
                return;
            }

            try {
                int donationId = Integer.parseInt(pathSegments[3]);
                handleRecommendation(exchange, donationId);
            } catch (NumberFormatException e) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid donation ID");
            }
        }

        private void handleRecommendation(HttpExchange exchange, int donationId) throws IOException {
            Donation donation = findDonationById(donationId);
            if (donation != null) {
                donation.setRecommended(true);
                sendResponse(exchange, HttpURLConnection.HTTP_OK, convertDonationsToJson());
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Donation not found");
            }
        }

        private void handleMessagePostRequest(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
            if (pathSegments.length != 4) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid URL");
                return;
            }
        
            try {
                int donationId = Integer.parseInt(pathSegments[3]);
                handleMessage(exchange, donationId);
            } catch (NumberFormatException e) {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid donation ID");
            }
        }
        
        private void handleMessage(HttpExchange exchange, int donationId) throws IOException {
            Donation donation = findDonationById(donationId);
            if (donation != null) {
                String requestBody = new String(exchange.getRequestBody().readAllBytes());
                System.out.println("Received message request for donation ID: " + donationId);
                System.out.println("Request body: " + requestBody);
                sendResponse(exchange, HttpURLConnection.HTTP_OK, "Message received for donation ID: " + donationId);
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Donation not found");
            }
        }        
    
        
        private void handleGetRequest(HttpExchange exchange) throws IOException {
            sendResponse(exchange, HttpURLConnection.HTTP_OK, convertDonationsToJson());
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String convertDonationsToJson() {
            StringBuilder json = new StringBuilder("[");
            for (Donation donation : donations) {
                json.append("{");
                json.append("\"id\":\"").append(donation.getId()).append("\",");
                json.append("\"itemName\":\"").append(donation.getItemName()).append("\",");
                json.append("\"itemDescription\":\"").append(donation.getItemDescription()).append("\",");
                json.append("\"recommended\":").append(donation.isRecommended()).append(",");
                json.append("\"category\":\"").append(donation.getCategory()).append("\",");
                json.append("\"email\":\"").append(donation.getEmail()).append("\"");
                json.append("},");
            }
            if (!donations.isEmpty()) {
                json.setLength(json.length() - 1);
            }
            json.append("]");
            return json.toString();
        }

        private Donation findDonationById(int donationId) {
            for (Donation donation : donations) {
                if (donation.getId().equals(String.valueOf(donationId))) {
                    return donation;
                }
            }
            return null;
        }
    }

    private static class Donation {
        private String id;
        private String itemName;
        private String itemDescription;
        private boolean recommended;
        private Category category;
        private String email;

        public Donation(String id, String itemName, String itemDescription, Category category, String email) {
            this.id = id;
            this.itemName = itemName;
            this.itemDescription = itemDescription;
            this.category = category;
            this.email = email;
        }

        public String getId() {
            return id;
        }

        public void setRecommended(boolean recommended) {
            this.recommended = recommended;
        }

        public String getItemName() {
            return itemName;
        }

        public String getItemDescription() {
            return itemDescription;
        }

        public boolean isRecommended() {
            return recommended;
        }

        public String getCategory() {
            return category.name();
        }

        public String getEmail() {
            return email;
        }
    }
}
