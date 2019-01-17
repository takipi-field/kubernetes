# Deploy the Backend

For full on prem installs, the backend can be installed in your cluster.

The backend [Dockerfile](Dockerfile) is based on the [On-Premises Installation](https://doc.overops.com/docs/non-docker-on-premises-installation) guide.

_Before deploying the backend, you'll need to [install Docker and Kubernetes](../README.md)_.

## Configure

Several files and environment variables are needed to run this container.

The container expects to find `my.server.properties`, `smtp.properties`, and `smtpserver.properties` contained in a `private` directory which is mounted into the `/opt/private` directory in the container. Alternatively, the Dockerfile can be modified to copy these files directly into an image. An [example files](private/) can be found in this repo. For more details about these files, see the [On-Premises Advanced Tasks](https://doc.overops.com/docs/on-premises-advanced-settings) guide.

Several environment variables are required:

**HOST_URL** *hostname within your cluster*  
**FRONTEND_URL** *external hostname for web browsers*  
**DB_TYPE** *database type*  
**DB_URL** *database server URL*  
**DB_USER** *database username*  
**DB_PASS** *database password*

In order to persist storage beyond the lifespan of the container, mount a volume to `/opt/takipi-server/storage`.

## Build

Build the image and tag it `overops-server`. This may take some time.

```console
docker build . -t overops-server
```

## Run in Docker

This container expects a `private` directory containing `.properties` files to be mounted into the `/opt/private` directory and a storage volume to be mounted into the `/opt/takipi-server/storage` directory. When running the container, we'll mount the `private` and `storage` directories into the container. Note that mount paths cannot be relative. We'll also set environment variables and forward port 8080 from the host machine to the container.

```console
docker run -p 8080:8080 \
--mount type=bind,source="$(pwd)"/private,target=/opt/private \
--mount type=bind,source="$(pwd)"/storage,target=/opt/takipi-server/storage \
-e HOST_URL=localhost \
-e FRONTEND_URL=localhost \
-e DB_TYPE=h2 \
overops-server
```

For debugging, it can be useful to run the container interactively:

```console
docker run -it overops-server /bin/bash
```

## Run in Kubernetes

In Kubernetes, we'll store all `properties` files and database connection info as a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/). Hostname, frontend URL, and database type are configured directly in the deployment configuration.

Create the configuration secret from local files:

```console
kubectl create secret generic overops-server \
--from-file=private/my.server.properties \
--from-file=private/smtp.properties \
--from-file=private/smtpserver.properties
```

Create the database connection secret from direct input:

```console
kubectl create secret generic overops-server-db \
--from-literal=user=<USERNAME_HERE> \
--from-literal=pass=<PASSWORD_HERE> \
--from-literal=url=<URL_HERE>
```

To create a Kubernetes deployment:

```console
kubectl create -f deployment.yaml
```

To make our deployment available to other pods running in the cluster, we'll create a service:

```console
kubectl create -f service.yaml
```

With the service running, go to `http://FRONTEND_URL` in a web browser and confirm your server is running.

To remove the deployment:

```console
kubectl delete -f deployment.yaml
```

To remove the service:

```console
kubectl delete -f service.yaml
```

## Next Steps

- [Create a Pod Preset for the Agent](../agent)
- [Deploy a Collector](../collector)
- [Monitoring containerized apps](../demos)
