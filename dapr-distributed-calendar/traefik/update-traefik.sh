#!/bin/sh

# Add the Traefik Helm repository
helm repo add traefik https://traefik.github.io/charts

# Update the Helm repositories
helm repo update

# Uninstall Traefik
helm uninstall traefik --namespace kube-system

# Reinstall Traefik
helm install traefik traefik/traefik --namespace kube-system --values traefik-values.yaml --wait

