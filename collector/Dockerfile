FROM openjdk:8-jre-slim
LABEL maintainer="support@overops.com"

ENV JVM_LIB_FILE /usr/local/openjdk-8/lib/amd64/server/libjvm.so

# install curl
RUN apt-get update; apt-get install -y curl

# rootless
RUN groupadd --gid 1000 overops
RUN adduser --home /opt/takipi --uid 1000 --gid 1000 overops
USER 1000:1000

# install into the /opt directory
WORKDIR /opt

# download and install the collector
RUN curl -sL https://app.overops.com/app/download?t=tgz | tar -xvzf -

# use mount to make installation.key and collector.properties available
WORKDIR /opt/takipi

RUN mkdir private \
 && touch private/installation.key \
 && touch private/installation.token \
 && touch private/collector.properties \
 && ln -s private/installation.key installation.key \
 && ln -s private/installation.token installation.token \
 && ln -s private/collector.properties collector.properties \
 && mkdir -p work
VOLUME ["/opt/takipi/private"]
VOLUME ["/opt/takipi/work"]

EXPOSE 6060

# run the service in the background, tailing the log to stdout
ENTRYPOINT /opt/takipi/bin/takipi-service& \
	tail -F /opt/takipi/log/bugtale_service.log -F /opt/takipi/log/bugtale_service_poco.log
