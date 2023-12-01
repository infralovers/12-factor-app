#!/bin/sh

# Replace 
find deploy* -type f -exec sed -i -e "s//$USER_ID/g" {} \;

# Replace 
find deploy* -type f -exec sed -i -e "s//$ANIMAL/g" {} \;

# Replace 
find deploy* -type f -exec sed -i -e "s//$HOST_IP/g" {} \;

# Replace 
find deploy* -type f -exec sed -i -e "s//$ENVIRONMENT/g" {} \;

# Replace 
find deploy* -type f -exec sed -i -e "s//$DOMAIN/g" {} \;

# create namespace
kubectl create namespace 12-factor-app

# install dapr
helm repo add dapr https://dapr.github.io/helm-charts/

# install dapr
helm upgrade --install dapr dapr/dapr \
--version=1.12 \
--namespace dapr-system \
--create-namespace \
--wait

# install dapr dashboard
helm install dapr-dashboard dapr/dapr-dashboard --namespace dapr-system --wait

# install redis
helm install redis oci://registry-1.docker.io/bitnamicharts/redis --namespace 12-factor-app --wait

# deploy the 12-factor-app
kubectl apply -f deploy/.
