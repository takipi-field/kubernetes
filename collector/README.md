# Collector container
Based on [Linux Rootless Collector Installation](https://doc.overops.com/docs/linux-rootless-collector-install)

docker build . -t overops-collector

run container:
docker run overops-collector

open port 6060 and mount private folder containing installation.key and collector.properties:
docker run -p 6060:6060 --mount type=bind,source="$(pwd)"/private,target=/opt/takipi/private overops-collector

run interactively:
docker run -it overops-collector /bin/bash

run in the background:
docker run -d overops-collector


kubernetes deploy:
kubectl create -f deployment.yaml

kubernetes remove deployment:
kubectl delete -f deployment.yaml