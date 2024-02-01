FROM openjdk:11 AS builder

WORKDIR /app

COPY .dockerignore /app/

COPY build.gradle gradlew gradlew.bat /app/
COPY gradle/ /app/gradle/

RUN chmod +x /app/gradlew && \
    /app/gradlew --version

COPY src/ /app/src/

RUN /app/gradlew clean build

FROM openjdk:11 AS runtime

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar /app/CommunitySupport.jar

EXPOSE 7000

CMD ["java", "-jar", "/app/CommunitySupport.jar"]



