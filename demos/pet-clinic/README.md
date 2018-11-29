# Pet Clinic demo
This image contains an the [Spring Pet Clinic](https://github.com/spring-projects/spring-petclinic) demo app.

For this exmaple, we'll create a Deployment. If you have not already created the `overops-collector-service`, see *[Deploy a Collector](../../collector)*.

First, build the image and tag it as `pet-clinic`:

```console
docker build . -t pet-clinic
```

First, [create the pod preset](../../agent) if you have not already done so.

Next, create a deployment:

```console
$ kubectl create -f deployment.yaml
```

When the Pod is running, go to [app.overops.com](https://app.overops.com/) and confirm connectivity.

To interact with the app, create a service which exposes port `30080` on the Minikube cluster node.

```console
$ kubectl create -f service.yaml
```

Get the Minikube node IP address:

```console
$ minikube ip
```

In a browser, navigate to http://\<minikube-ip\>:30080

### Troubleshooting
- Confirm environmental variables and files are correct. See [Sanity Check](../../agent/#sanity-check)
- Verify the collector deployment `kubectl get deployments`
- Verify the collector service `kubectl get services`
