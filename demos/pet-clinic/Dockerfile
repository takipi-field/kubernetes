FROM centos:6

RUN yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel git

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the spring boot pet clinic demo app
RUN git clone https://github.com/spring-projects/spring-petclinic.git . ; ./mvnw package

CMD ["java", "-jar", "/opt/demo/target/spring-petclinic-2.1.0.BUILD-SNAPSHOT.jar"]