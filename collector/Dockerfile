FROM centos:6

# java-1.8.0-openjdk-devel git maven
RUN yum install -y java-1.8.0-openjdk wget

ENV JAVA_HOME /etc/alternatives/jre

# # set default environmental variables
# ENV TAKIPI_AGENT_HOME=/opt/takipi
# ENV TAKIPI_COLLECTOR_HOST=collector
# ENV TAKIPI_COLLECTOR_PORT=6060
# ENV JAVA_TOOL_OPTIONS=-agentpath:$TAKIPI_AGENT_HOME/lib/libTakipiAgent.so

WORKDIR /opt

# download and install the collector
RUN wget -O takipi-latest.tar.gz -q https://app.overops.com/app/download?t=tgz \
 && tar -xvzf takipi-latest.tar.gz \
 && rm takipi-latest.tar.gz


# use mount to make installation.key and collector.properties available
WORKDIR /opt/takipi
RUN mkdir private \
 && touch private/installation.key \
 && touch private/collector.properties \
 && ln -s private/installation.key installation.key \
 && ln -s private/collector.properties collector.properties
VOLUME ["/opt/takipi/private"]

# alternately, copy installation.key and collector.properties into the image
# COPY installation.key /opt/takipi/.
# COPY collector.properties /opt/takipi/.

CMD ["/opt/takipi/bin/takipi-service", "-nfd", "-l"]