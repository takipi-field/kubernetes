FROM centos:6

RUN yum install -y java-1.8.0-openjdk-devel git

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the event generator demo app
RUN git clone https://github.com/takipi-field/overops-event-generator . ; ./mvnw clean package -DskipTests

CMD ["java", "-jar", "/opt/demo/target/overops-event-generator-2.1.3.jar", "-Dtakipi.application.name=EventGenerator", "Dtakipi.deployment.name=v2.1.3"]
