FROM openjdk:8-jre-slim

# set default environmental variables
ENV TAKIPI_AGENT_HOME=/takipi
ENV TAKIPI_COLLECTOR_HOST=collector
ENV TAKIPI_COLLECTOR_PORT=6060
ENV JAVA_TOOL_OPTIONS=-agentpath:$TAKIPI_AGENT_HOME/lib/libTakipiAgent.so

# install curl
RUN apt-get update && apt-get -y install curl

# set working directory
WORKDIR /

# download and install the agent - extracts into the `takipi` folder.
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -
