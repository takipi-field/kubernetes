Useful Docker commands:

[Docker cheat sheet](https://www.docker.com/sites/default/files/Docker_CheatSheet_08.09.2016_0.pdf)
docker container ls
docker image ls

remove all containers:
docker container rm $(docker container ps -aq)

remove all images:
docker image rm $(docker image ls -q)

[Install minikube](https://kubernetes.io/docs/setup/minikube/)

Useful Kubernetes commands:

start minikube cluster:
minikube start

start minikube cluster with pod presets enabled:
minikube start --extra-config=apiserver.runtime-config=api/all=true --extra-config=apiserver.admission-control="NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset"

put Docker in Minikube mode: / set env vars to tell Docker about Minikube
eval $(minikube docker-env)

^^ you must build Docker images after running this command to make your local images available to your Minikube Kubernetes cluster

create from a config file:
kubectl create -f config.yaml

kubectl get deployments

kubectl logs -l app=overops-collector

kubectl create -f service.yaml
kubectl get services
kubectl delete -f service.yaml

kubectl get pods

kubectl autoscale deployment overops-collector-deployment --min=1 --max=3
kubectl get hpa
kubectl delete hpa overops-collector-deployment