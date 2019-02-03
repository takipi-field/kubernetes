FROM centos:6

# set default environmental variables
ENV TAKIPI_AGENT_HOME=/takipi
ENV TAKIPI_COLLECTOR_HOST=collector
ENV TAKIPI_COLLECTOR_PORT=6060
ENV JAVA_TOOL_OPTIONS=-agentpath:$TAKIPI_AGENT_HOME/lib/libTakipiAgent.so

# set working directory
WORKDIR /

# download and install the agent - extracts into the `takipi` folder.
# NOTE for Alpine, use: https://s3.amazonaws.com/sam.sparktale/samv2/snapshots/native/native.0.2449/takipi-alpine-agent-native.0.2449.tar.gz
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -

# run script copies data from the /takipi folder into the /shared-data folder and keep the container running
COPY run.sh /
RUN chmod +x run.sh

CMD ["/run.sh"]
