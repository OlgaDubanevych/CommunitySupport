package backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.Headers;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Jobs {

    private static final List<JobPost> jobPosts = new ArrayList<>();
    private static int jobIdCounter = 1;

    public static void main(String[] args) throws IOException {
        com.sun.net.httpserver.HttpServer server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(7000), 0);
        server.createContext("/api/jobs", new JobsHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server is running on port 7000");
    }

    public static class JobsHandler implements HttpHandler {
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

            if ("DELETE".equals(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                if (path.matches("/api/jobs/\\d+")) {
                    String jobId = path.replaceAll("/api/jobs/(\\d+)", "$1");
                    handleDeleteRequest(exchange, jobId);
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

        private void handleDeleteRequest(HttpExchange exchange, String jobId) throws IOException {
            JobPost jobPost = findJobPostById(jobId);
            if (jobPost != null) {
                jobPosts.remove(jobPost);
                sendResponse(exchange, 200, convertJobPostsToJson());
            } else {
                sendResponse(exchange, 404, "Job post not found");
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = new String(exchange.getRequestBody().readAllBytes());

            Pattern datePattern = Pattern.compile("\"jobPostingDate\":\"(.*?)\"");
            Pattern expiryDatePattern = Pattern.compile("\"expiryDate\":\"(.*?)\"");
            Pattern companyNamePattern = Pattern.compile("\"companyName\":\"(.*?)\"");
            Pattern jobTitlePattern = Pattern.compile("\"jobTitle\":\"(.*?)\"");
            Pattern descriptionPattern = Pattern.compile("\"jobDescription\":\"(.*?)\"");
            Pattern locationPattern = Pattern.compile("\"location\":\"(.*?)\"");
            Pattern salaryPattern = Pattern.compile("\"salary\":\"(.*?)\"");
            Pattern firstNamePattern = Pattern.compile("\"firstName\":\"(.*?)\"");
            Pattern lastNamePattern = Pattern.compile("\"lastName\":\"(.*?)\"");
            Pattern emailPattern = Pattern.compile("\"email\":\"(.*?)\"");
            Pattern phonePattern = Pattern.compile("\"phone\":\"(.*?)\"");

            Matcher dateMatcher = datePattern.matcher(requestBody);
            Matcher expiryDateMatcher = expiryDatePattern.matcher(requestBody);
            Matcher companyNameMatcher = companyNamePattern.matcher(requestBody);
            Matcher jobTitleMatcher = jobTitlePattern.matcher(requestBody);
            Matcher descriptionMatcher = descriptionPattern.matcher(requestBody);
            Matcher locationMatcher = locationPattern.matcher(requestBody);
            Matcher salaryMatcher = salaryPattern.matcher(requestBody);
            Matcher firstNameMatcher = firstNamePattern.matcher(requestBody);
            Matcher lastNameMatcher = lastNamePattern.matcher(requestBody);
            Matcher emailMatcher = emailPattern.matcher(requestBody);
            Matcher phoneMatcher = phonePattern.matcher(requestBody);

            if (dateMatcher.find() && expiryDateMatcher.find() && companyNameMatcher.find() && jobTitleMatcher.find() && descriptionMatcher.find() && locationMatcher.find() && salaryMatcher.find() && firstNameMatcher.find() && lastNameMatcher.find() && emailMatcher.find() && phoneMatcher.find()) {
                String jobPostingDate = dateMatcher.group(1);
                String expiryDate = expiryDateMatcher.group(1);
                String companyName = companyNameMatcher.group(1);
                String jobTitle = jobTitleMatcher.group(1);
                String jobDescription = descriptionMatcher.group(1);
                String location = locationMatcher.group(1);
                String salary = salaryMatcher.group(1);
                String firstName = firstNameMatcher.group(1);
                String lastName = lastNameMatcher.group(1);
                String email = emailMatcher.group(1);
                String phone = phoneMatcher.group(1);

                JobPost newJobPost = new JobPost(String.valueOf(jobIdCounter++), jobPostingDate, expiryDate, companyName, jobTitle, jobDescription, location, salary, firstName, lastName, email, phone);

                jobPosts.add(newJobPost);
                sendResponse(exchange, 200, convertJobPostsToJson());
            } else {
                sendResponse(exchange, 400, "Invalid JSON format");
            }
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            String searchTerm = "";
            String query = exchange.getRequestURI().getQuery();
               if (query != null && query.contains("searchTerm")) {
                searchTerm = query.split("=")[1];
}



            if (searchTerm != null) {
                String[] searchWords = searchTerm.trim().toLowerCase().split("\\s+");

                List<JobPost> filteredJobs = jobPosts.stream()
                        .filter(jobPost -> {
                            String lowerCaseTitle = jobPost.getJobTitle().toLowerCase();
                            String lowerCaseCompany = jobPost.getCompanyName().toLowerCase();
                            String lowerCaseLocation = jobPost.getLocation().toLowerCase();

                            return Arrays.stream(searchWords)
                                    .anyMatch(word ->
                                            lowerCaseTitle.contains(word) ||
                                                    lowerCaseCompany.contains(word) ||
                                                    lowerCaseLocation.contains(word)
                                    );
                        })
                        .collect(Collectors.toList());

                sendResponse(exchange, 200, convertJobPostsToJson(filteredJobs));
            } else {
                sendResponse(exchange, 200, convertJobPostsToJson());
            }
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private String convertJobPostsToJson(List<JobPost> jobPosts) {
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

        private String convertJobPostsToJson() {
            return convertJobPostsToJson(jobPosts);
        }

        private static JobPost findJobPostById(String jobId) {
            for (JobPost jobPost : jobPosts) {
                if (jobPost.getId().equals(jobId)) {
                    return jobPost;
                }
            }
            return null;
        }
    }

    private static class JobPost {
        private String id;
        private String jobPostingDate;
        private String expiryDate;
        private String companyName;
        private String jobTitle;
        private String jobDescription;
        private String location;
        private String salary;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;

        public JobPost(String id, String jobPostingDate, String expiryDate, String companyName, String jobTitle, String jobDescription, String location, String salary, String firstName, String lastName, String email, String phone) {
            this.id = id;
            this.jobPostingDate = jobPostingDate;
            this.expiryDate = expiryDate;
            this.companyName = companyName;
            this.jobTitle = jobTitle;
            this.jobDescription = jobDescription;
            this.location = location;
            this.salary = salary;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"jobPostingDate\":\"%s\",\"expiryDate\":\"%s\",\"companyName\":\"%s\",\"jobTitle\":\"%s\",\"jobDescription\":\"%s\",\"location\":\"%s\",\"salary\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"}", id, jobPostingDate, expiryDate, companyName, jobTitle, jobDescription, location, salary, firstName, lastName, email, phone);
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public String getCompanyName() {
            return companyName;
        }

        public String getLocation() {
            return location;
        }

        public String getId() {
            return id;
        }
    }
}
