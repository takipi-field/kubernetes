# Deploy the Storage Server (hybrid installations)
For hybrid installations, the Storage Server can be installed in your cluster.

The Storage Server [Dockerfile](Dockerfile) is based on the [Installing the Storage Server on a Local Server](https://doc.overops.com/docs/installing-the-storage-server-on-a-local-server) guide, with some minor modifications.

For complete instructions on performing a hybrid installation, refer to the [Hybrid Installation on Linux](https://doc.overops.com/docs/linux-hybrid-installation) guide.

## Build
If you're deploying this image locally on a Minikube cluster, first set the Docker environmental variables:

```console
$ eval $(minikube docker-env)
```

Build the image and tag it `overops-storage-server`.

```console
$ docker build . -t overops-storage-server
```

## Run in Docker
To persist data for longer than the lifetime of a container, mount a volume to the `/opt/takipi-storage/storage` directory.
We'll also forward port 8080 (application) and 8081 (admin) from the host machine to the container.

```console
$ docker run -p 8080:8080 -p 8081:8081 --mount type=bind,source="$(pwd)"/storage,target=/opt/takipi-storage/storage overops-storage-server
```

For debugging, it can be useful to run the container interactively:

```console
$ docker run -it overops-storage-server /bin/bash
# ./run.sh
```

To run in the background:

```console
$ docker run -d -p 8080:8080 -p 8081:8081 --mount type=bind,source="$(pwd)"/storage,target=/opt/takipi-storage/storage overops-storage-server
```

## Run in Kubernetes
Choose the [Volume](https://kubernetes.io/docs/concepts/storage/volumes/) type that makes the most sense for your cluster. When running locally in Minikube, we'll use [hostPath](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath).

To create a Kubernetes deployment:

```console
$ kubectl create -f deployment.yaml
```

To make our deployment available to other pods running in the cluster and the outside world, create a service:

```console
$ kubectl create -f service.yaml
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
$ kubectl delete -f deployment.yaml
```

To remove the service:

```console
$ kubectl delete -f service.yaml
```
