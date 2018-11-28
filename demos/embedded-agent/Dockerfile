FROM centos:6

RUN yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel git wget

ENV JAVA_HOME /etc/alternatives/jre

WORKDIR /opt/demo

# use the event generator demo app
RUN git clone https://github.com/takipi-field/overops-event-generator . ; ./mvnw clean package -DskipTests

# set default environmental variables
ENV TAKIPI_AGENT_HOME=/opt/takipi
ENV TAKIPI_COLLECTOR_HOST=collector
ENV TAKIPI_COLLECTOR_PORT=6060
ENV JAVA_TOOL_OPTIONS=-agentpath:$TAKIPI_AGENT_HOME/lib/libTakipiAgent.so

WORKDIR /opt

# download and install the agent
RUN wget -q https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz \
 && tar -xvzf takipi-agent-latest.tar.gz \
 && rm takipi-agent-latest.tar.gz

CMD ["java", "-jar", "/opt/demo/target/overops-event-generator-2.0.0.jar"]