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
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(Level.ALL);
            logger.addHandler(consoleHandler);
            logger.setLevel(Level.ALL);

            HttpServer server = HttpServer.create(new InetSocketAddress(7000), 0);

            server.createContext("/api/questions", new Questions.QuestionsHandler());
            server.createContext("/api/jobs", new Jobs.JobsHandler());
            server.createContext("/api/applications", new JobApplication.ApplicationsHandler());
            server.createContext("/api/donations", new Donations.DonationsHandler());
            server.createContext("/api/stories", new SuccessStories.StoriesHandler());
            server.createContext("/api/consultants", new Consultants.ConsultantsHandler());
            server.createContext("/api/websites", new Websites.WebsiteHandler());
            server.createContext("/api/poll", new Poll.PollHandler());

            server.setExecutor(null);
            server.start();
            logger.info("Server is running on port 7000");

        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error starting the server", e);
        }
    }
}
