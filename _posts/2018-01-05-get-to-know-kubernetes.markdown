---
title: Get to know Kubernetes
date: 2018-01-05 09:14:00 -06:00
tags:
- kubernetes
- container
- orachestration
layout: post
---

More and more applications start to adopt container technologies to help development and operation of software on physical or virtual infrastructures. It is crucial to managing containers and connecting them to customers for tasks like scheduling, load balancing, and distribution. The orchestration tools like kubernetes and swarm become necessary.
<!--more-->

## What is it.
> Kubernetes is an open-source platform designed to automate deploying, scaling, and operating application containers. [kubernetes.io](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

## Set up local cluster

the minikube is the easiest way to have one node cluster on your local laptop

1. Head to [GitHub](https://github.com/kubernetes/minikube) download latest binaries

2. on your laptop, type 

```
   minikube start --vm-driver="hyperv"
```

this assumes windows OS and hypervisor is enabled

3. verify the cluster is ready

```
   kubectl version
```