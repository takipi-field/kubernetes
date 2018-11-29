FROM centos:6

# set working directory
WORKDIR /

# download and install the agent - extracts into the `takipi` folder.
RUN curl -sL https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvzf -

# run script copies data from the /takipi folder into the /shared-data folder and keep the container running
COPY run.sh /
RUN chmod +x run.sh

CMD ["/run.sh"]
