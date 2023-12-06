# Use an official OpenJDK runtime as a parent image
FROM openjdk:11

# Set the working directory
WORKDIR /app

# Copy only the necessary source files to the container
COPY backend /app/backend

# Compile the Java code
RUN javac -d . backend/*.java

# Expose the port
EXPOSE 7000

# Run the Java application
CMD ["java", "backend.JavaBackend"]


