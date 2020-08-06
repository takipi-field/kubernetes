FROM alpine:3.11

# install dependencies
RUN apk add curl

RUN mkdir /takipi

# rootless
RUN addgroup -g 1000 overops
RUN adduser -D -h /opt/takipi -u 1000 -G overops overops

RUN chown overops:overops takipi

# rootless
USER 1000:1000

# set working directory
WORKDIR /opt

# download and installs the Alpine agent - extracts into the `takipi` folder.
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/alpine/takipi-agent-latest.tar.gz | tar -xvzf -

# print version
RUN cat takipi/VERSION

# share /takipi between containers in a pod
VOLUME ["/takipi/"]

WORKDIR /opt/takipi

# create a run script to copy /opt/takipi/ (latest agent) to /takipi/ (shared)
RUN echo "#!/bin/sh" > run.sh \
 && echo "cat /opt/takipi/VERSION" >> run.sh \
 && echo "cp -a /opt/takipi/. /takipi/" >> run.sh \
 && chmod +x run.sh

CMD ["./run.sh"]
