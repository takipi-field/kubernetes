FROM centos:6

RUN mkdir /takipi

# rootless
RUN groupadd --gid 1000 overops
RUN adduser --home /opt/takipi --uid 1000 -g 1000 overops

RUN chown overops:overops takipi

# rootless
USER 1000:1000

# set working directory
WORKDIR /opt

# download and install the agent - extracts into the `takipi` folder.
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -

# print version
RUN cat takipi/VERSION

# share /takipi between containers in a pod
VOLUME ["/takipi/"]

WORKDIR /opt/takipi

# create a run script to copy /opt/takipi/ (latest agent) to /takipi/ (shared)
RUN echo "#!/bin/bash" > run.sh \
 && echo "cat /opt/takipi/VERSION" >> run.sh \
 && echo "cp -a /opt/takipi/. /takipi/" >> run.sh \
 && echo "exit 0" >> run.sh \
 && chmod +x run.sh

CMD ["./run.sh"]
