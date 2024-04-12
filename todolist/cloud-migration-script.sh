#!/bin/bash

# Set variables
PROJECT_ID="cloud-computing-cisc5550"
ZONE="us-central1-a"
INSTANCE_NAME="test-instance-1"
SOURCE_FILES=("todolist.db" "todolist.py") # List of files to upload
DESTINATION_PATH="~" # Destination path on the VM
TEMPLATES_FOLDER="templates" # Destination folder for templates
DEPENDENCIES=("python3-pip" "python3.11-venv") # List of dependencies to install
VIRTUAL_ENV_DIR="~" # Directory for the virtual environment
VIRTUAL_ENV_NAME="albert-env" # Venv name

# Creating the VM
gcloud compute instances create $INSTANCE_NAME \
    --project $PROJECT_ID \
    --zone $ZONE \
    --machine-type "e2-micro" \
    --image-family "debian-12" \
    --image-project "debian-cloud" \
    --boot-disk-size "10GB" \
    --tags "http-server-80"

# Create firewall rule to allow incoming traffic on port 80
gcloud compute firewall-rules create allow-http \
    --project $PROJECT_ID \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:80 \
    --source-ranges=0.0.0.0/0

# Copying files to VM
for file in "${SOURCE_FILES[@]}"; do
    gcloud compute scp $file $INSTANCE_NAME:$DESTINATION_PATH --zone $ZONE
done

# Creating templates folder
gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "mkdir $TEMPLATES_FOLDER"

# Uploading index.html file to the templates folder
gcloud compute scp ./templates/index.html $INSTANCE_NAME:./$TEMPLATES_FOLDER --zone $ZONE

# Installing dependencies
gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "sudo apt-get update && sudo apt-get install -y ${DEPENDENCIES[*]}"

# Create virtual environment on VM
gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "cd $VIRTUAL_ENV_DIR && python3 -m venv $VIRTUAL_ENV_NAME"

# Activate virtual environment and install Flask
gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "source $VIRTUAL_ENV_DIR/$VIRTUAL_ENV_NAME/bin/activate && pip install Flask"

gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "echo INSTALLING DEPENDENCIES"

# Running todolist.py remotely
gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "source $VIRTUAL_ENV_DIR/$VIRTUAL_ENV_NAME/bin/activate && sudo $VIRTUAL_ENV_DIR/$VIRTUAL_ENV_NAME/bin/python3 todolist.py"