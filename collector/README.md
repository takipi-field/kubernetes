# Deploy a Collector

The Collector [Dockerfile](Dockerfile) is based on the [Linux Rootless Collector Installation](https://doc.overops.com/docs/linux-rootless-collector-install) guide.

_Before deploying the collector, you'll need to [install Docker and Kubernetes](../README.md)_

Two files are needed to run this container: `installation.key` and `collector.properties`. The container expects these two files to be contained in a `private` directory which is mounted into the `/opt/takipi/private` directory in the container. Alternatively, the Dockerfile can be modified to copy these two files directly into an image. An example [collector.properties](private/collector.properties.saas.example) can be found in this repo. For more details about these files, see the [rootless guide](https://doc.overops.com/docs/linux-rootless-collector-install).

## Quick Start

This image is on Docker Hub: [overops/collector](https://hub.docker.com/r/overops/collector)

### Docker Quick Start

```console
docker run -d -p 6060:6060 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi/private overops/collector
```

### Kubernetes Quick Start

```console
kubectl create secret generic overops-collector --from-file=./installation.key --from-file=./collector.properties
kubectl apply -f https://raw.githubusercontent.com/takipi-field/kubernetes/master/collector/overops-collector.yaml
```

## Build

If you're deploying this image locally on a Minikube cluster, first set the Docker environmental variables:

```console
eval $(minikube docker-env)
```

Build the image and tag it `overops-collector`. This may take some time.

```console
docker build . -t overops-collector
```

## Run in Docker

This container expects a `private` directory containing `installation.key` and `collector.properties` to be mounted into the `/opt/takipi/private` directory. When running the container, we'll mount the `private` directory into the container. Note that mount paths cannot be relative. We'll also forward port 6060 from the host machine to the container.

```console
docker run -p 6060:6060 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi/private overops-collector
```

For debugging, it can be useful to run the container interactively:

```console
docker run --mount type=bind,source="$(pwd)"/private,target=/opt/takipi/private -it overops-collector /bin/bash
```

To run in the background:

```console
docker run -d -p 6060:6060 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi/private overops-collector
```

## Run in Kubernetes

In Kubernetes, we'll store `installation.key` and `collector.properties` as a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/). This allows for streamlined management of installation keys and configurations.

Create the secret from local files:

```console
kubectl create secret generic overops-collector --from-file=./installation.key --from-file=./collector.properties
```

Modify [`overops-collector.yaml`](overops-collector.yaml) as needed for your environment, then create the deployment and service:

```console
kubectl apply -f overops-collector.yaml
```

With the service running, go to [app.overops.com](https://app.overops.com/) and confirm your Collector is connected.

![Image confirming Collector is connected](collector-connected.png)

To update, set the deployment container image to the latest version:

```console
kubectl set image deployment.v1.apps/overops-collector-deployment overops-collector=overops/collector:4.30.8 --record
```

To remove:

```console
kubectl delete -f overops-collector.yaml
```

### Note about Security Context

Starting with version 4.56.0, all published images to Docker hub are now "rootless." Images are now using the base image openjdk:8-jre-slim and running with user ID 1000 and group ID 1000 instead of the root user. This is now reflected in the kubernetes deployment's security context.

## Next Steps

- [Create a Pod Preset for the Agent](../agent)
- [Monitoring containerized apps](../demos)
