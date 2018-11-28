Useful Docker commands:

remove all containers:
docker container rm $(docker container ps -aq)

remove all images:
docker image rm $(docker image ls -q)

[Install minikube](https://kubernetes.io/docs/setup/minikube/)

Useful Kubernetes commands:

start minikube cluster:
minikube start

put Docker in Minikube mode:
eval $(minikube docker-env)

create from a config file:
kubectl create -f config.yaml

kubectl get deployments

kubectl logs -l app=overops-collector

kubectl create -f service.yaml
kubectl get services
kubectl delete -f service.yaml

kubectl get pods