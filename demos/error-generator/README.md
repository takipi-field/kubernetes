# Error generator demo
This image contains an error generator demo app. The agent must be added manually with a volume mount and by setting environmental variables, or automatically with a pod preset.

For this exmaple, we'll create and deploy a Pod to our cluster. If you have not already created the `overops-collector-service`, see *[Deploy a Collector](../../collector)*.

First, build the image and tag it as `embedded-agent`:

```console
docker build . -t error-generator
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

### Manual
Alternatively, we can mount the volume and set environmental variables directly in the Pod config file.

```console
$ kubectl create -f volume-mount.yaml
```

### Troubleshooting
- Confirm environmental variables and files are correct. See [Sanity Check](../../agent/#sanity-check)
- Verify the collector deployment `kubectl get deployments`
- Verify the collector service `kubectl get services`
