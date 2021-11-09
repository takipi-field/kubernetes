# Deploying OverOps in a Kubernetes cluster
Starting from scratch, we'll deploy a Kubernetes cluster locally with Minikube, we'll build and deploy the Collector as a service in the cluster, and we'll attach the Agent to error generating demo apps.

## Prerequisites
First, install [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/) if you have not already done so. 

### Install Docker
Download and install [Docker Community Edition](https://store.docker.com/search?type=edition&offering=community) for your platform. I'm using the [Mac edition](https://store.docker.com/editions/community/docker-ce-desktop-mac).

After installing, you'll have the `docker` command available from the command line.

```console
$ docker --version
Docker version 18.09.0, build 4d60db4
```

### Install Kubectl
Download and install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/). If you're on a Mac, I recommend using [Homebrew](https://brew.sh/) to install kubectl:

```console
$ brew install kubernetes-cli
```

After installing, you'll have the `kubectl` command available from the command line.

```console
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"12", GitVersion:"v1.12.2", GitCommit:"17c77c7898218073f14c8d573582e8d2313dc740", GitTreeState:"clean", BuildDate:"2018-10-30T21:39:38Z", GoVersion:"go1.11.1", Compiler:"gc", Platform:"darwin/amd64"}
Unable to connect to the server: dial tcp 192.168.99.100:8443: i/o timeout
```

### Install Minikube
Download and install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) according to the instructions for the [latest release](https://github.com/kubernetes/minikube/releases). See [Running Kubernetes locally via Minikube](https://kubernetes.io/docs/setup/minikube/) to familiarize yourself with the tool.

After installing, you'll have the `minikube` command available from the command line.

```console
$ minikube version
minikube version: v0.30.0
```

## Start your cluster
To start the cluster, simply run `minikube start`:

```console
$ minikube start
```

### Set Docker environmental variables
Prior to building Docker images, you'll need to configure your Docker environment to use your Minikube cluster by running the following command:

```console
$ eval $(minikube docker-env)
```

This command needs to be run each time you open a new command line window.

*Heads up! When building local images to deploy with Kubernetes, set `imagePullPolicy: Never` on the container spec. This prevents your cluster from attempting to remotely fetch a local image.*

### Stop your cluster
To stop the cluster, simply run `minikube stop`.

## Next Steps

- [Deploy a Collector](collector)
- [Deply an Application with an Agent](agent)
- [Monitor containerized apps](demos)

## Docker Commands Cheat Sheet
Basic Docker commands can be found on the [Docker Cheat Sheet](https://www.docker.com/sites/default/files/Docker_CheatSheet_08.09.2016_0.pdf)

- build a container `docker build . -t my-container`
- run a container `docker run my-container`
- run a container interactively `docker run -it my-container /bin/bash`
- list containers `docker container ls`
- list images `docker image ls`
- remove all containers `docker container rm $(docker container ls -aq)`
- remove all images `docker image rm $(docker image ls -q)`

## Kubernetes Commands Cheat Sheet
Basic Kubernetes command can be found on the [Kubernetes Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

- create from a config file `kubectl create -f config.yaml`
- delete from a config file `kubectl delete -f config.yaml`
- get pods `kubectl get pods`
- get deployments `kubectl get deployments`
- get services `kubectl get services`
- tail pod logs `kubectl tail -f my-pod`
- get logs for a deployment by tag `kubectl logs -l app=my-app`
- scale a deployment `kubectl scale deployment my-deployment --replicas=3`
- autoscale a deployment `kubectl autoscale deployment my-deployment --min=1 --max=3`
- get autoscaling rules `kubectl get hpa`
- delete autoscaling rule `kubectl delete hpa my-deployment`
