# Use an official OpenJDK runtime as a parent image
FROM openjdk:11

# Set the working directory
WORKDIR /app

# Copy the source code to the container
COPY . /app

# Compile the Java code
RUN javac *.java

# Expose the port
EXPOSE 7000

# Run the Java application
CMD ["java", "JavaBackend"]


