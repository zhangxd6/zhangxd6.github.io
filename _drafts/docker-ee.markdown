---
title: Play with Docker EE
date: 2018-04-28 11:39:00 -05:00
tags:
- docker EE
---


## Create local cluster via Vagrant

We will create a there node cluster, 1 manager and 2 worker node

```
manager_ip = "10.0.3.2"

Vagrant.configure(2) do |config|

  config.vm.define "manager" do |manager|
    manager.vm.hostname = "manager"
    manager.vm.box = "ubuntu/trusty64"
    manager.vm.network "private_network", ip: manager_ip

    manager.vm.provider "virtualbox" do |v|
      v.cpus = 2
      v.memory = 4096
    end
  end

  (1..2).each do |i|
    config.vm.define "worker-#{i}" do |worker|
      worker.vm.hostname = "worker-#{i}"
      worker.vm.box = "ubuntu/trusty64"
      worker.vm.network "private_network", ip: "10.0.3.#{i+2}"

      worker.vm.provider "virtualbox" do |v|
        v.cpus = 1
        v.memory = 1024
      end
    end
  end
end
```

## Install docker 

### Docker trial
### Install script

```
sudo apt-get remove docker docker-engine docker-ce docker.io

DOCKER_EE_URL="YOUR DOCKER EE URL"

curl -fsSL "${DOCKER_EE_URL}/ubuntu/gpg" | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] $DOCKER_EE_URL/ubuntu \
   $(lsb_release -cs) \
   stable-17.06"

sudo apt-get update

sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    docker-ee
```

## Set up UCP

On manager node 
```
sudo docker run --rm -it --name ucp -v /var/run/docker.sock:/var/run/docker.sock docker/ucp install --host-address 10.0.3.2 --interactive --force-minimums
```

Once success, you should be able to access UCP web portal

## Add workers
1. login to UCP web interface
2. Click add node
3. copy and paste the command to the console of worker

## Deploy WordPress to swarm
1. Share resource
2. Stacks
3. Create Stack
4. select swarm 
5 paste docker-compose.yml 
```
version: '3.1'

services:
  app:
    image: wordpress
    deploy:
      replicas: 3
      labels:
        com.docker.lb.hosts: "WORDPRESS.Local"
        com.docker.lb.port: 80
    environment:
      - "WORDPRESS_DB_HOST=mariadb:3306"
      - "WORDPRESS_DB_USER=wordpress"
      - "WORDPRESS_DB_PASSWORD=wordpress"
    ports:
      - 80
    networks:
      - wordpress-network

  mariadb:
    image: mariadb
    deploy:
      replicas: 1
    environment:
      - "MYSQL_ROOT_PASSWORD=wordpress"
      - "MYSQL_DATABASE=wordpress"
      - "MYSQL_USER=wordpress"
      - "MYSQL_PASSWORD=wordpress"
    networks:
      - wordpress-network
    volumes:
     - db:/data/db

volumes:
  db:
    driver: local

networks:
  wordpress-network:
    driver: overlay
  ucp-hrm:
    external: true
```