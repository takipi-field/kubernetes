# Sidecar Agent

This container contains a copy of the Agent in it's `/opt/takipi` directory. At run time, it copies the contents of this directory into the `/takipi` directory. After copying it stops running.

*Before building the sidecar, you'll need to [install Docker and Kubernetes](../../README.md).*

To build the sidecar:

```console
docker build . -t sidecar-agent
```

## Demo App

The [event generator](../../demos/event-generator) contains an example Kubernetes [sidecar.yaml](../../demos/event-generator/sidecar.yaml) config file illustrating how to use this container.

### Note about Security Context

Starting with version 4.56.0, all published images to Docker hub are now "rootless." Images are now using the base image openjdk:8-jre-slim and running with user ID 1000 and group ID 1000 instead of the root user. This is now reflected in the kubernetes deployment's security context. 

For the `agent-sidecar` make sure to apply the correct security context for the init-container in order to avoid permission issues. Note that the application pod can run as a different user, as the permissions for the volume mount will allow this.