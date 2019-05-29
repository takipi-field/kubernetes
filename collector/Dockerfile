FROM centos:6

# install OpenJDK 8
RUN yum install -y java-1.8.0-openjdk

# set env vars
ENV JAVA_HOME /etc/alternatives/jre
ENV JVM_LIB_FILE /etc/alternatives/jre/lib/amd64/server/libjvm.so
ENV TAKIPI_LISTEN_PORT 6060
ENV TAKIPI_BASE_URL https://backend.overops.com

# install into the /opt directory
WORKDIR /opt

# download and install the collector
RUN curl -sL https://app.overops.com/app/download?t=tgz | tar -xvzf -

# use mount to make installation.key and collector.properties available
WORKDIR /opt/takipi
RUN mkdir private \
 && touch private/installation.key \
 && touch private/collector.properties \
 && ln -s private/installation.key installation.key \
 && ln -s private/collector.properties collector.properties
VOLUME ["/opt/takipi/private"]

EXPOSE 6060

# run the service in verbose mode, printing logs to stdout
CMD ["/opt/takipi/bin/takipi-service", "-l"]