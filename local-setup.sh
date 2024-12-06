#!/usr/bin/env bash

# Check if Docker is installed
if [ ! command -v docker &>/dev/null ]; then
    # Install Docker
    echo "Docker is not installed. Installing..."

    # Update package index
    sudo apt-get update

    # Install Docker
    sudo apt  install docker.io

    # Add User to docker Group
    sudo usermod -aG docker $USER
    echo "Docker has been installed. Rerun the script to continue!"
    newgrp docker
fi

# Prepare Dapr environment
cd ~

if [ ! command dapr &>/dev/null ]; then
    wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
    dapr init # to initialize dapr
fi

if [ ! -d "update-golang" ]; then
    # Prepare Golang environment
    git clone https://github.com/udhos/update-golang
    cd update-golang
    sudo ./update-golang.sh
fi


if [ ! command -v python3 &>/dev/null ]; then
    echo "Python 3 is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y python3
fi

if [ ! command -v npm &> /dev/null ]; then
    # Prepare Node environment
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs
fi

source /etc/profile.d/golang_path.sh
# Setup dapr config
mkdir -p ~/.dapr
cp -r ~/12-factor-app/dapr-distributed-calendar/local/components ~/.dapr

# Build Golang application
cd ~/12-factor-app/dapr-distributed-calendar/go
go build go_events.go

# Install Python Requirements
cd ~/12-factor-app/dapr-distributed-calendar/python
if [ ! -d "venv" ]; then
    virtualenv venv --python /usr/bin/python3
fi
source venv/bin/activate
pip3 install -r ./requirements.txt

# Install Node Requirements
cd ~/12-factor-app/dapr-distributed-calendar/node
npm install
