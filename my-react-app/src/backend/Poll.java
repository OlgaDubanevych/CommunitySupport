package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

import com.sun.net.httpserver.Headers;

public class Poll {

    private static final Map<String, Integer> pollData = new HashMap<>();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/poll", new PollHandler());
        server.setExecutor(null);
        server.start();
    }

    static class PollHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Enable CORS
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");

            String method = exchange.getRequestMethod();
            if (method.equals("POST")) {
                handlePoll(exchange);
            } else if (method.equals("GET")) {
                handleGetPollResults(exchange);
            } else {
                sendResponse(exchange, 400, "Bad Request");
            }
        }

        private void handlePoll(HttpExchange exchange) throws IOException {
            // Extract the selected option from the URL parameter
            String selectedOption = exchange.getRequestURI().getQuery().replace("option=", "");

            if (!selectedOption.isEmpty()) {
                handlePollVote(exchange, selectedOption);
            } else {
                sendResponse(exchange, 400, "Invalid option");
            }
        }

        private void handlePollVote(HttpExchange exchange, String selectedOption) throws IOException {
            pollData.compute(selectedOption, (key, value) -> (value == null) ? 1 : value + 1);
            sendResponse(exchange, 200, "Poll vote submitted successfully");
        }

        private void handleGetPollResults(HttpExchange exchange) throws IOException {
            try {
                // Convert pollData to JSON-like string manually
                StringBuilder json = new StringBuilder("{");
                for (Map.Entry<String, Integer> entry : pollData.entrySet()) {
                    json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue()).append(",");
                }
                if (!pollData.isEmpty()) {
                    json.setLength(json.length() - 1); // Remove the trailing comma
                }
                json.append("}");

                sendResponse(exchange, 200, json.toString());
            } catch (Exception e) {
                sendResponse(exchange, 500, "Internal Server Error");
            }
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
}
