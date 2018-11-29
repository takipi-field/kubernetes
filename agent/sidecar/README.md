# Sidecar Agent
This container contains a copy of the Agent in it's `/takipi` directory. At run time, it copies the contents of this directory into the `/shared-data` directory. After copying, it enters an infinite loop to keep it running in the cluster.

*Before building the sidecar, you'll need to [install Docker and Kubernetes](../../README.md).*

To build the sidecar:

```console
$ docker build . -t sidecar-agent
```

# Demo App
The [error generator](../../demos/error-generator) contains an example Kubernetes [sidecar.yaml](../../demos/error-generator/sidecar.yaml) config file illustrating how to use this container.