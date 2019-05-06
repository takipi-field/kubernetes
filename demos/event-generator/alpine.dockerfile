FROM openjdk:8-jdk-alpine

WORKDIR /opt/demo

# use the event generator demo app
COPY overops-event-generator/target/overops-event-generator-2.1.3.jar .

CMD ["java", "-jar", "/opt/demo/overops-event-generator-2.1.3.jar"]