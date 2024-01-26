FROM openjdk:11

WORKDIR /app

COPY . /app/backend

RUN javac -d . backend/*.java

EXPOSE 7000

CMD ["java", "backend.JavaBackend"]

