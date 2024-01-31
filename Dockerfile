# Use a multi-stage build for better efficiency
# Build stage
FROM openjdk:11 AS builder

WORKDIR /app

# Add .dockerignore to exclude unnecessary files from build context
COPY .dockerignore /app/

# Copy only the necessary files for building
COPY build.gradle gradlew gradlew.bat /app/
COPY gradle/ /app/gradle/

# Download and cache the dependencies
RUN chmod +x /app/gradlew && \
    /app/gradlew --version

# Only copy the necessary source files
COPY src/ /app/src/

# Build the application
RUN /app/gradlew clean build

# Runtime stage
FROM openjdk:11 AS runtime

WORKDIR /app

# Copy the built JAR file if it exists
COPY --from=builder /app/build/libs/*.jar /app/CommunitySupport.jar

EXPOSE 7000

# CMD to run your Java application
CMD ["java", "-jar", "/app/CommunitySupport.jar"]



