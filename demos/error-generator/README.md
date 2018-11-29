# Error generator demo
This image contains an error generator demo app. The agent must be added manually with a volume mount and by setting environmental variables, or automatically with a pod preset.

For this exmaple, we'll create a Pod or Deployment in our cluster. If you have not already created the `overops-collector-service`, see *[Deploy a Collector](../../collector)*.

Build the image and tag it as `error-generator`:

```console
$ docker build . -t error-generator
```

### Pod Preset
First, [create the pod preset](../../agent).

Next, deploy the app as a Pod or a Deployment:

```console
$ kubectl create -f pod.yaml
```

```console
$ kubectl create -f deployment.yaml
```
When the Pod is running, go to [app.overops.com](https://app.overops.com/) and confirm connectivity.

### Manual
Alternatively, we can mount the volume and set environmental variables directly in the Pod config file.

```console
$ kubectl create -f volume-mount.yaml
```

### Sidecar
If directly mounting a volume or using a pod preset are not viable options, a sidecar can be used instead. First, build the [agent sidecar](../../agent/sidecar) image. This image contains a copy of the Agent in it's `/takipi` directory which it will copy to it's `/shared-data` directory. We'll create a temporary shared volume using [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir). On the sidecar, the shared volume is mounted to `/shared-data`. On the error generator, the shared volume is mounted to the `/takipi` directory.

```console
$ kubectl create -f sidecar.yaml
```

### Troubleshooting
- Confirm environmental variables and files are correct. See [Sanity Check](../../agent/#sanity-check)
- Verify the collector deployment `kubectl get deployments`
- Verify the collector service `kubectl get services`
