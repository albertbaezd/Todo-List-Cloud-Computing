#!/bin/bash

# Docker file configuration

# Build
docker build --platform linux/amd64 -t djninjatv/todolist:v1.4 .
# List images to confirm the image details
docker images
# Push the image to our account’s container repository
docker push djninjatv/todolist:v1.4

# Gcloud configuration

# Create cluster
gcloud container clusters create cluster-todolist \
    --zone us-central1-c \
    --num-nodes 1 \
    --machine-type e2-micro \
    --disk-size=10GB

# Get the cluster credentials
gcloud container clusters get-credentials cluster-todolist --zone us-central1-c

# Kubernetes configuration

# Apply Kubernetes manifest
kubectl apply -f deployment.yaml

# Show pod status
kubectl get pods

# Show running services
kubectl get services
