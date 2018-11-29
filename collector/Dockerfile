FROM centos:6

# install OpenJDK 8
RUN yum install -y java-1.8.0-openjdk

# set JAVA_HOME
ENV JAVA_HOME /etc/alternatives/jre

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

# alternately, copy installation.key and collector.properties into the image
# COPY installation.key /opt/takipi/
# COPY collector.properties /opt/takipi/

# run the service in verbose mode, printing logs to stdout
CMD ["/opt/takipi/bin/takipi-service", "-nfd", "-l"]