FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/*.jar
COPY ./target/warranty-tracker-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
ARG SPRING_PROFILES_ACTIVE
ENV SPRING_PROFILES_ACTIVE=docker