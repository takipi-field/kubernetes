FROM openjdk:8-jre-slim

# set default environmental variables
ENV TAKIPI_COLLECTOR_HOST=collector
ENV TAKIPI_COLLECTOR_PORT=6060
ENV JAVA_TOOL_OPTIONS=-agentpath:/takipi/lib/libTakipiAgent.so
# to include application and deployment name:
# ENV JAVA_TOOL_OPTIONS=-agentpath:/takipi/lib/libTakipiAgent.so=takipi.application.name=<app name here>,takipi.deployment.name=<app version here>

# install curl
RUN apt-get update && apt-get -y install curl

# set working directory
WORKDIR /

# download and install the agent - extracts into the `takipi` folder.
# NOTE: for Apline linux, use: https://s3.amazonaws.com/sam.sparktale/samv2/snapshots/native/native.0.2449/takipi-alpine-agent-native.0.2449.tar.gz
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -
