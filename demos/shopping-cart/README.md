# Shopping Cart demo
This image contains the shopping cart demo app.

For this exmaple, we'll create a Deployment. If you have not already created the `overops-collector-service`, see *[Deploy a Collector](../../collector)*.

Build the image and tag it as `shopping-cart`:

```console
$ docker build . -t shopping-cart
```

First, [create the pod preset](../../agent) if you have not already done so.

Next, create a deployment:

```console
$ kubectl create -f deployment.yaml
```

When the Pod is running, go to [app.overops.com](https://app.overops.com/) and confirm connectivity.

### Troubleshooting
- Confirm environmental variables and files are correct. See [Sanity Check](../../agent/#sanity-check)
- Verify the collector deployment `kubectl get deployments`
- Verify the collector service `kubectl get services`
