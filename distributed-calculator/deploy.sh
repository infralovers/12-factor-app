#!/bin/sh

# Replace <ENV-USER-ID>
find deploy* -type f -exec sed -i -e "s/<ENV-USER-ID>/$USER_ID/g" {} \;

# Replace <ENV-ANIMAL>
find deploy* -type f -exec sed -i -e "s/<ENV-ANIMAL>/$ANIMAL/g" {} \;

# Replace <ENV-IP>
find deploy* -type f -exec sed -i -e "s/<ENV-IP>/$HOST_IP/g" {} \;

# Replace <ENV-NAME>
find deploy* -type f -exec sed -i -e "s/<ENV-NAME>/$ENVIRONMENT/g" {} \;

# Replace <ENV-DOMAIN>
find deploy* -type f -exec sed -i -e "s/<ENV-DOMAIN>/$DOMAIN/g" {} \;

# create namespace
kubectl create namespace 12-factor-app

# install redis
helm install redis oci://registry-1.docker.io/bitnamicharts/redis --namespace 12-factor-app --wait

# deploy the 12-factor-app
kubectl apply -f deploy/.
