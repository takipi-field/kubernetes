# Embedded agent
Snippet to embed the agent on a debian:stretch-slim OpenJDK 8 image

docker build . -t embedded-agent

run interactively:
docker run -it embedded-agent /bin/bash
