FROM centos:6

RUN yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel git

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the event generator demo app
RUN git clone https://github.com/takipi-field/overops-event-generator . ; ./mvnw clean package -DskipTests

# set default environmental variables
ENV TAKIPI_AGENT_HOME=/takipi
ENV JAVA_TOOL_OPTIONS=-agentpath:$TAKIPI_AGENT_HOME/lib/libTakipiAgent.so

WORKDIR /

# download and install the agent - extracts into the `takipi` folder.
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -

CMD ["java", "-jar", "/opt/demo/target/overops-event-generator-2.1.3.jar"]