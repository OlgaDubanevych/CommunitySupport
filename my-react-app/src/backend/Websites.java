package backend;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Websites {

    private static final List<Website> websites = new ArrayList<>();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/websites", new WebsiteHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class WebsiteHandler implements HttpHandler {

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

            String path = exchange.getRequestURI().getPath();

            if ("POST".equals(exchange.getRequestMethod())) {
                if ("/api/websites".equals(path)) {
                    handlePostRequest(exchange);
                } else if ("/api/websites/all".equals(path)) {
                    handleSendAllWebsites(exchange);
                } else if ("/api/websites/all-average-ratings".equals(path)) {
                    handleSendAllWebsites(exchange);
                } else if (path.matches("/api/websites/\\d+")) {
                    handleGetWebsite(exchange);
                } else if (path.matches("/api/websites/\\d+/rate")) {
                    handleRating(exchange);
                } else {
                    sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not Found");
                }
            } else if ("GET".equals(exchange.getRequestMethod())) {
                if (path.matches("/api/websites/\\d+")) {
                    handleGetWebsite(exchange);
                } else if (path.matches("/api/websites/\\d+/average-rating")) {
                    handleAverageRatingGetRequest(exchange);
                } else if ("/api/websites/all-average-ratings".equals(path)) {
                    handleGetAllAverageRatings(exchange);
                } else {
                    sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not Found");
                }
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_METHOD, "Method Not Allowed");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern websiteNamePattern = Pattern.compile("\"websiteName\":\"(.*?)\"");
            Pattern websiteDescriptionPattern = Pattern.compile("\"websiteDescription\":\"(.*?)\"");
            Pattern urlPattern = Pattern.compile("\"url\":\"(.*?)\"");

            Matcher websiteNameMatcher = websiteNamePattern.matcher(requestBody);
            Matcher websiteDescriptionMatcher = websiteDescriptionPattern.matcher(requestBody);
            Matcher urlMatcher = urlPattern.matcher(requestBody);

            if (websiteNameMatcher.find() && websiteDescriptionMatcher.find() && urlMatcher.find()) {
                String websiteName = websiteNameMatcher.group(1);
                String websiteDescription = websiteDescriptionMatcher.group(1);
                String url = urlMatcher.group(1);

                Website newWebsite = new Website(websiteName, websiteDescription, url);

                websites.add(newWebsite);
                sendResponse(exchange, HttpURLConnection.HTTP_OK, newWebsite.toJson());
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid JSON format");
            }
        }
        
        private void handleSendAllWebsites(HttpExchange exchange) throws IOException {
            try {
              InputStream requestBodyStream = exchange.getRequestBody();
              String requestBody = new String(requestBodyStream.readAllBytes());
          
              Website[] websitesArray = Website.fromJsonArray(requestBody);
          
              for (Website website : websitesArray) {
                updateBackend(website.getId(), website.getAverageRating());
              }
          
              sendResponse(exchange, HttpURLConnection.HTTP_OK, "All websites received and added successfully");
            } catch (Exception e) {
              sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid data format");
            }
          }
          
      
        private void updateBackend(String websiteId, double averageRating) {
            Website website = findWebsiteById(Integer.parseInt(websiteId));
            if (website != null) {
                website.setAverageRating(averageRating);
            }
        }
        
        private void handleRating(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
        
            if (pathSegments.length >= 5 && "api".equals(pathSegments[1]) && "websites".equals(pathSegments[2]) && "rate".equals(pathSegments[4])) {
                try {
                    int websiteId = Integer.parseInt(pathSegments[3]);
                    handleRating(exchange, websiteId);
                } catch (NumberFormatException e) {
                    sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid website ID");
                }
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not Found");
            }
        }
        
        private void handleRating(HttpExchange exchange, int websiteId) throws IOException {
            Website website = findWebsiteById(websiteId);
            if (website != null) {
                try (InputStream requestBodyStream = exchange.getRequestBody()) {
                    String requestBody = new String(requestBodyStream.readAllBytes());
                    Pattern ratingPattern = Pattern.compile("\"rating\":(\\d+)");
                    Matcher ratingMatcher = ratingPattern.matcher(requestBody);
        
                    if (ratingMatcher.find()) {
                        int ratingValue = Integer.parseInt(ratingMatcher.group(1));
                        website.addRating(ratingValue);
        
                        double updatedAverageRating = website.calculateAverageRating();
                        sendResponse(exchange, HttpURLConnection.HTTP_OK, String.valueOf(updatedAverageRating));
                    } else {
                        sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid JSON format");
                    }
                }
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Website not found");
            }
        }
        
   
        private void handleGetWebsite(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");
            int websiteId = Integer.parseInt(pathSegments[3]);
            Website website = findWebsiteById(websiteId);

            if (website != null) {
                sendResponse(exchange, HttpURLConnection.HTTP_OK, website.toJson());
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Website not found");
            }
        }

        private void handleAverageRatingGetRequest(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] pathSegments = path.split("/");

            if (pathSegments.length == 4) {
                try {
                    int websiteId = Integer.parseInt(pathSegments[3]);
                    handleAverageRating(exchange, websiteId);
                } catch (NumberFormatException e) {
                    sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid website ID");
                }
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_BAD_REQUEST, "Invalid URL");
            }
        }

        private void handleAverageRating(HttpExchange exchange, int websiteId) throws IOException {
            Website website = findWebsiteById(websiteId);
            if (website != null) {
                double averageRating = website.calculateAverageRating();
                sendResponse(exchange, HttpURLConnection.HTTP_OK, String.valueOf(averageRating));
            } else {
                sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Website not found");
            }
        }

        private void handleGetAllAverageRatings(HttpExchange exchange) throws IOException {
            try {
                StringBuilder responseText = new StringBuilder();
                for (Website website : websites) {
                    double averageRating = website.calculateAverageRating();
                    responseText.append(String.format("%d=%s, ", Integer.parseInt(website.getId()), averageRating));
                }
                responseText.setLength(responseText.length() - 2);
        
                sendResponse(exchange, HttpURLConnection.HTTP_OK, responseText.toString());
            } catch (Exception e) {
                sendResponse(exchange, HttpURLConnection.HTTP_INTERNAL_ERROR, "Internal Server Error");
            }
        }
        
        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private Website findWebsiteById(int websiteId) {
            for (Website website : websites) {
                if (Integer.parseInt(website.getId()) == websiteId) {
                    return website;
                }
            }
            return null;
        }
        
    }

    public static class Website {
        private String websiteId;
        private String websiteName;
        private String websiteDescription;
        private String url;
        private List<Integer> ratings = new ArrayList<>();
        private double averageRating = 0.0;

        public Website(String websiteName, String websiteDescription, String url) {
            this.websiteId = String.valueOf(websites.size() + 1);
            this.websiteName = websiteName;
            this.websiteDescription = websiteDescription;
            this.url = url;
        }

        public String getId() {
            return websiteId;
        }

        public String toJson() {
            return String.format("{\"websiteId\":\"%s\",\"websiteName\":\"%s\",\"websiteDescription\":\"%s\",\"url\":\"%s\",\"averageRating\":%s}",
                    websiteId, websiteName, websiteDescription, url, averageRating);
        }

        public static Website[] fromJsonArray(String jsonArray) {
            List<Website> websiteList = new ArrayList<>();
            Pattern websitePattern = Pattern.compile("\\{.*?\\}");
            Matcher websiteMatcher = websitePattern.matcher(jsonArray);

            while (websiteMatcher.find()) {
                String websiteJson = websiteMatcher.group();
                Website website = fromJson(websiteJson);
                websiteList.add(website);
            }

            return websiteList.toArray(new Website[0]);
        }

        private static Website fromJson(String jsonString) {
            String websiteName = extractValue(jsonString, "websiteName");
            String websiteDescription = extractValue(jsonString, "websiteDescription");
            String url = extractValue(jsonString, "url");

            return new Website(websiteName, websiteDescription, url);
        }

        private static String extractValue(String jsonString, String key) {
            Pattern pattern = Pattern.compile("\"" + key + "\":\"(.*?)\"");
            Matcher matcher = pattern.matcher(jsonString);

            if (matcher.find()) {
                return matcher.group(1);
            } else {
                return null;
            }
        }

        public void addRating(int rating) {
            ratings.add(rating);
            calculateAverageRating();
        }

        public double calculateAverageRating() {
            if (ratings.isEmpty()) {
                averageRating = 0.0;
            } else {
                int sum = 0;
                for (int rating : ratings) {
                    sum += rating;
                }
                averageRating = (double) sum / ratings.size();
            }
            return averageRating;
        }

        public void setWebsiteId(String websiteId) {
            this.websiteId = websiteId;
        }
    
        public void setAverageRating(double averageRating) {
            this.averageRating = averageRating;
        }

        public double getAverageRating() {
            return averageRating;
        }
    }
} 