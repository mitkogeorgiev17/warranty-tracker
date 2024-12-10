# Use a base image with Java
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Spring Boot jar into the container
COPY target/warranty-tracker-0.0.1-SNAPSHOT.jar warranty-tracker-0.0.1-SNAPSHOT.jar

# Run the application
ENTRYPOINT ["java", "-jar", "warranty-tracker-0.0.1-SNAPSHOT.jar"]
