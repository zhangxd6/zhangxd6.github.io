---
title: Prepare DCA Note - Docker Swarm
date: 2019-01-27 15:27:00 -06:00
tags:
- docker
layout: post
---

Docker Swarn is an enterprise-grade secure cluster of docker hosts and an engine for orchestrating microservices apps.
<!--more-->
* out of the box you get an encrypted distributed cluster store, encrypted networks, mutual TLS, secure cluster join tokens and a PKI the makes managing and rotating certificate a breeze.
* on the orchestration front, swarm exposes a rich API that allows you to deploy and manage complicated microservices app with ease.

# Nodes 
* manager - control plane of the cluster, manage the state of the cluster and dispatching tasks to workers
* workers - execute work tasks from managers.

* the configuration and state are held in distributed etcd database on all managers. It is in memory and extremely up-to-date.

* TLS to encrypt communications, authenticate nodes and authorize roles, Auto key rotations

* service is the atomic unit of scheduling on a swarm


# Build Swarm cluster

# ports requirement
  * 2377/tcp - secure client to daemon communication
  * 7946/tcp and 7946/udp - control plane gossip
  * 4789/udp VXLAN based overlay network

# Swarm HA
lead-follower; followers proxy the request to the leader.
1. The odd number of managers
2. Don't have too many managers(3-5)

# Security

old manager rejoin can pose security concern since it will decrypt all configurations and logs.

```
  docker swarm init --autolock
  docker swarm update --autolock=true
  docker swarm unlock
  docker swarm unlock-key --rotate
```
this can ask to unlock key before the manager joins the cluster.

# service 
```
  docker service create --replicas 1 --name ''
  docker service ls
  docker service scale servicename=#
  docker service update --replicas=# servicename
```

* service mode
  1. replicated (default) - distribute them evenly
  2 global (--mode global) - a single replica on every node.-- can't scale 

* service port

```
  docker service create --name name --publish published=8080,target=80 (routing mesh)

 docker service create --name name --publish published=8080,target=80,mode=host (Node)

 docker service create --name name --publish published=8080,target=80,mode=host --mode global (every node)

```
