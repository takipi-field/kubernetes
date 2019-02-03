# Deploy the Storage Server - S3 (hybrid installations, AWS S3)

For hybrid installations, the Storage Server can be installed in your cluster.

*This example stores data in an S3 bucket. To store data on a persistent volume, see [Deploy the Storage Server - PV](../)*

This Storage Server [Dockerfile](Dockerfile) is based on the [Installing the Storage Server on AWS S3](https://doc.overops.com/docs/installing-the-storage-server-on-aws-s3) guide, with some minor modifications.

For complete instructions on performing a hybrid installation, refer to the [Hybrid Installation on Linux](https://doc.overops.com/docs/linux-hybrid-installation) guide.

The file `settings.yaml` must be mounted into the `/opt/takipi-storage/private` directory to run this container. An example [settings.yaml](private/settings.yaml) can be found in this repo.

## Quick Start

This image is on Docker Hub: [overops/storage-server-s3](https://hub.docker.com/r/overops/storage-server-s3)

### Docker Quick Start

```console
docker run -d -p 8080:8080 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi-storage/private overops/storage-server-s3
```

### Kubernetes Quick Start

```console
kubectl create secret generic overops-storage --from-file=./settings.yaml
kubectl apply -f https://raw.githubusercontent.com/takipi-field/kubernetes/master/hybrid/s3/deployment.yaml
kubectl apply -f https://raw.githubusercontent.com/takipi-field/kubernetes/master/hybrid/s3/service.yaml
```

## Build

If you're deploying this image locally on a Minikube cluster, first set the Docker environmental variables:

```console
eval $(minikube docker-env)
```

Build the image and tag it `overops-storage-server`.

```console
docker build . -t overops-storage-server
```

## Run in Docker

This container expects a `private` directory containing `settings.yaml` to be mounted into the `/opt/takipi-storage/private` directory. When running the container, we'll mount the `private` directory into the container. We'll also forward port 8080 from the host machine to the container.

```console
docker run -p 8080:8080 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi-storage/private overops-storage-server
```

For debugging, it can be useful to run the container interactively:

```console
$ docker run -it --mount type=bind,source="$(pwd)"/private,target=/opt/takipi-storage/private overops-storage-server /bin/bash
# ./run.sh
```

To run in the background:

```console
docker run -d -p 8080:8080 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi-storage/private overops-storage-server
```

## Run in Kubernetes

In Kubernetes, we'll store `setting.yaml` as a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/).

Create the secret from local file:

```console
kubectl create secret generic overops-storage --from-file=./settings.yaml
```

To create a Kubernetes deployment:

```console
kubectl create -f deployment.yaml
```

To make our deployment available to other pods running in the cluster and the outside world, create a service:

```console
kubectl create -f service.yaml
```

[Verifying Storage Server Installation](https://doc.overops.com/docs/verifying-storage-server-installation)

To verify when running in Minikube:

```console
$ curl -I http://$(minikube ip):30080/storage/v1/diag/ping
HTTP/1.1 200 OK
Date: Wed, 05 Dec 2018 15:55:05 GMT
Content-Type: text/plain
Content-Length: 2
```

To remove the deployment:

```console
kubectl delete -f deployment.yaml
```

To remove the service:

```console
kubectl delete -f service.yaml
```