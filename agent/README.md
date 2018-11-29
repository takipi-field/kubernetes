# Create an Agent Pod Preset
A [Pod Preset](https://kubernetes.io/docs/concepts/workloads/pods/podpreset/) automatically applies the environmental variables and volume mounts needed to inject the Agent into pods tagged with a specific label.

*Before creating a Pod Preset, you'll need to [install Docker and Kubernetes](../README.md).*

*Pod Presets must be enabled on the cluster. If using Minikube, start the cluster with this command:*

```console
$ minikube start --extra-config=apiserver.runtime-config=api/all=true --extra-config=apiserver.admission-control="NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset"
```

For this exmaple, we'll use hostPath to mount files from the host into the pod. See [Volume](https://kubernetes.io/docs/concepts/storage/volumes/) for more details and options.

Download and extract the latest agent into the `takipi` directory.

```console
$ curl -s https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvz -
```

Update path in [pod-preset.yaml](pod-preset.yaml) to the location of the `takipi` folder you just downloaded - e.g. `/Users/overopsdaves/workspace/kubernetes/agent/takipi/`

This preset matches pods with the label `takipi: inject-agent`.

The `TAKIPI_COLLECTOR_HOST` environmental variable is set to the name of our Collector service: `overops-collector-service`. *See [Deploy a Collector](../collector) if you haven't yet deployed the Collector service.*

Create the preset:

```console
$ kubectl create -f pod-preset.yaml
```

List presets:

```console
$ kubectl get podPresets
```

Delete the preset:

```console
$ kubectl delete podPreset overops-agent-pod-preset
```

Pods will pick up the preset on create. Delete any currently running pods that you which to pick up the preset. If using a deployment, these pods will automatically be recreated. If running pods directly, manually recreate your pods.

### Sanity Check
To confirm your pod has picked up the preset, start a shell on your running pod:

```console
$ kubectl exec -it my-pod /bin/bash
```

If using the sidecar approach, where there are multiple containers in a single pod, specify the correct container:

```console
$ kubectl exec -it my-pod --container main-app -- /bin/bash
```

Check for environmental variables:

```console
# env | grep TAKIPI
TAKIPI_COLLECTOR_HOST=overops-collector-service
TAKIPI_COLLECTOR_PORT=6060
TAKIPI_AGENT_HOME=/takipi

# env | grep JAVA_TOOL
JAVA_TOOL_OPTIONS=-agentpath:/takipi/lib/libTakipiAgent.so
```

Confirm the Agent library is present:

```console
# ls /takipi/lib
ibHSAgent.so            libPocoUtil.so.12  libZingAgent.so  sparkle.jar
libJ9Agent.so            libPocoXML.so.12   rt_sup_j9.jar
libPocoFoundation.so.12  libTakipiAgent.so  rt_sup.jar
```

Exit from the pod:

```console
# exit
```

Look in the logs for `picked up JAVA_TOOL_OPTIONS`:

```console
$ kubectl logs -f my-pod
Picked up JAVA_TOOL_OPTIONS: -agentpath:/takipi/lib/libTakipiAgent.so
```

Confirm tags:
```console
$ kubectl get pods --selector=takipi=inject-agent
```

## Next Steps

- [Monitor containerized apps](../demos)

# Embedded Agent
This [Dockerfile](Dockerfile) illustrates how the Agent can be embedded directly into an image. See the [embedded agent demo](../demos/embedded-agent) for a complete working example.

# Sidecar Agent
This [Dockerfile](sidecar/Dockerfile) illustrates how the Agent can be run as a sidecar.