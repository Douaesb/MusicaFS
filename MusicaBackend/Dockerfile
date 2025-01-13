FROM maven:3.8.3-openjdk-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean install -DskipTests

FROM openjdk:17-jdk

WORKDIR /app

COPY --from=builder /app/target/Musica-0.0.1-SNAPSHOT.jar Musica.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "Musica.jar"]
