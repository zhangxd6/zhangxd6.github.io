---
title: Prepare DCA Note - Docker Enterprise Engine
date: 2019-02-06 21:56:00 -06:00
tags:
- Docker
layout: post
---

Docker EE is docker for the enterprise. It is a suite of products.
<!--more-->
# Components
  * DTR - secure on-premise Registry
  * Docker Universal Control Plane - Enterprise-grade Operation UI
  * Docker EE - certified container engine
  * Certified OS/Cloud platform - Certified infrastructure
#Docker EE
  * two version
    * CE
    * EE - quarterly release with time-based versioning scheme like 18.06.x-ee 
  * installation
```
sudo apt-get remove docker docker-engine docker-ce docker.io

DOCKER_EE_URL="https://storebits.docker.com/ee/ubuntu/sub-62432feb-d6b1-4014-853b-38a8262010b1"

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
# Docker Universal Control Plane
#backup swarm
 1. stop docker on a manager
 2. copy /var/lib/docker/swarm
 3. restart docker 
```
  service docker restart
```
#UCP backup
```
  docker container run --log-driver none --rm 0i --name ucp -v /var/run/docker.sock:/var/run/docker.sock docker/ucp:2.2.5 backup --interactive --passphrase "" > ucp.bkp
```
# UCP Recover
1. stop docker
2. delete existing swarm confi
```
rm -r /var/lib/docker/swarm
```
3. rstore swarm config
4. init docker 
```
  docker swarm init --force-new-cluster
```
5. restore UCP
```
 docker container run --rm -i --name ucp -v /var/lib/docker.sock:/var/lib/docker.sock docker/ucp:2.2.5 restore --passphrase ""<ucp.bkp
```
# Docker Trusted Registry 

# Enterprise-grade features

## Role-based access control
  * grant
    - Subject - one or more users/team
    - role - a set of permissions
    - collection - the resources the permissions apply to
## Active Directory Integration
## Docker Content Trust
## Configuring/Using Docker Trusted Regristry
## Image Promotions
  * build policy-based automated pipelines to promote images through a set of repositories in DTR
## HTTP Routing Mesh
  * layer-7 routing
  * allow multiple swarm services to be published on the same swarm-wide port, with ingress traffic being routed to the right service based on hostname data stored in the HTTP header.

