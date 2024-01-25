#!/bin/sh

# Prepare Dapr environment
mkdir $HOME/.dapr
cp -r ~/12-factor-app/dapr-distributed-calendar/local/components ~/.dapr

wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
dapr init # to initialize dapr

# Prepare Golang environment
git clone https://github.com/udhos/update-golang
cd update-golang
sudo ./update-golang.sh
source /etc/profile.d/golang_path.sh

# Build Golang application
cd ~/12-factor-app/dapr-distributed-calendar/go
go build go_events.go

# Prepare Python environment
# Check if python3.11 is available in the PATH
if command -v python3.11 &>/dev/null; then
    echo "Python 3.11 is installed on this machine."
else
    echo "Python 3.11 is not found on this machine."
    sudo apt update
    sudo apt install python3.11
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
    python3 --version
fi

# Install Python Requirements
cd ~/12-factor-app/dapr-distributed-calendar/python
pip3 install -r ./requirements.txt 

# Prepare Node environment
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs

# Install Node Requirements
cd ~/12-factor-app/dapr-distributed-calendar/node
npm install
