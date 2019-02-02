FROM centos:6

RUN yum install -y java-1.8.0-openjdk-devel git

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the spring boot pet clinic demo app
RUN git clone https://github.com/spring-projects/spring-petclinic.git . ; ./mvnw package

EXPOSE 8080

CMD ["java", "-jar", "/opt/demo/target/spring-petclinic-2.1.3.BUILD-SNAPSHOT.jar"]