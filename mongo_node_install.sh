#!/bin/bash
# Simple script to install node and mongo on Ubuntu
confirm() {
    read -r -p "${1:-Would you like to install Node and Mongo on Ubuntu? [y/N]} " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            local __result=true
            ;;
        *)
            local __result=false
            ;;
    esac
    echo "$__result"
}
echo "******************************************************************"
echo "* This will install Node and Mongo on Ubuntu.                    *"
echo "* To run a Node project please run npm install and npm run dev   *"
echo "******************************************************************"
res=$(confirm)
if $res; then
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm 
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
fi
