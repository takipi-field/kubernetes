# Error generator demo
Basic CentOS 6 image with OpenJDK 8 an error generator app.

docker build . -t error-generator

docker run error-generator

run interactively:
docker run -it error-generator /bin/bash

run in the background:
docker run -d error-generator

kubectl create -f pod.yaml
kubectl get pods -o wide
kubectl get pods --selector=takipi=inject-agent

kubectl logs -f error-generator-pod

kubectl exec -it error-generator-pod -- /bin/bash

kubectl delete pod error-generator-pod

kubectl create -f deployment.yaml
kubectl get deployments
kubectl get pods


# if using pod presets...
sanity check..
kubectl exec -it pod /bin/bash
env | grep TAKIPI
env | grep JAVA_TOOL
cd /takipi
ls

kubectl logs -f pod # look for "picked up JAVA_TOOL_OPTIONS