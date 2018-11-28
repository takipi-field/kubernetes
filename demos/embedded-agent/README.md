# Embedded agent with error generator demo
Basic CentOS 6 image with OpenJDK 8 an error generator and the OverOps agent.

docker build . -t embedded-agent-demo

docker run embedded-agent-demo

run interactively:
docker run -it embedded-agent-demo /bin/bash

run in the background:
docker run -d embedded-agent-demo