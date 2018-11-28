# Embedded agent
Snippet to embed the agent on a debian:stretch-slim OpenJDK 8 image

docker build . -t embedded-agent

run interactively:
docker run -it embedded-agent /bin/bash

# Pod Preset
- download the latest agent:
curl -s https://s3.amazonaws.com/app-takipi-com/deploy/linux/takipi-agent-latest.tar.gz | tar -xvz -

update hostpath path to the location of the takipi folder you just downloaded - e.g. /Users/overopsdaves/workspace/kubernetes/agent/takipi/

enable pod presets in your cluster. when using minikube:
minikube start --extra-config=apiserver.runtime-config=api/all=true --extra-config=apiserver.admission-control="NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset"

create the preset:
kubectl create -f pod-preset.yaml

kubectl get podPresets
kubectl delete podPreset overops-agent-pod-preset

pods will pick up the preset on create. delete any currently running pods that you which to pick up the preset. if using a deployment, these pods will automatically be recreated. if running pods directly, manually recreate your pods.

sanity check..
kubectl exec -it pod /bin/bash
env | grep TAKIPI
env | grep JAVA_TOOL
cd /takipi
ls

kubectl logs -f pod # look for "picked up JAVA_TOOL_OPTIONS