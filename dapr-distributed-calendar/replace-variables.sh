#!/bin/sh

# Replace 01
find * -type f -exec sed -i -e "s/<ENV-USER-ID>/$USER_ID/g" {} \;

# Replace owl
find * -type f -exec sed -i -e "s/<ENV-ANIMAL>/$ANIMAL/g" {} \;

# Replace cno
find * -type f -exec sed -i -e "s/<ENV-NAME>/$ENVIRONMENT/g" {} \;

# Replace co-pla.training
find * -type f -exec sed -i -e "s/<ENV-DOMAIN>/$DOMAIN/g" {} \;