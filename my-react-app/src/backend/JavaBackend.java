package backend;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

public class JavaBackend {
    private static final Logger logger = Logger.getLogger(JavaBackend.class.getName());

    public static void main(String[] args) {
        try {
            // Configure the logger
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(Level.ALL);
            logger.addHandler(consoleHandler);
            logger.setLevel(Level.ALL);

            // Create the main server on port 7000
            HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);

            // Create a context for the '/api/questions' endpoint
            server.createContext("/api/questions", new Questions.QuestionsHandler());
            server.createContext("/api/jobs", new Jobs.JobsHandler());
            server.createContext("/api/applications", new JobApplication.ApplicationsHandler());
            server.createContext("/api/donations", new Donations.DonationsHandler());
            server.createContext("/api/stories", new SuccessStories.StoriesHandler());

            // Start the server
            server.setExecutor(null);
            server.start();
            logger.info("Server is running on port 7000");

        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error starting the server", e);
        }
    }
}
