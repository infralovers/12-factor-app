#!/bin/sh

# Replace USER_ID
find dapr* -type f -exec sed -i -e "s/<ENV-USER-ID>/$USER_ID/g" {} \;

# Replace ANIMAL
find dapr* -type f -exec sed -i -e "s/<ENV-ANIMAL>/$ANIMAL/g" {} \;

# Replace ENVIRONMENT
find dapr* -type f -exec sed -i -e "s/<ENV-NAME>/$ENVIRONMENT/g" {} \;

# Replace DOMAIN
find dapr* -type f -exec sed -i -e "s/<ENV-DOMAIN>/$DOMAIN/g" {} \;