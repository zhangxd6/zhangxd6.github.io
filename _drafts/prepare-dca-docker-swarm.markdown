---
title: Prepare DCA - Docker Swarm
date: 2019-01-27 15:27:00 -06:00
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
