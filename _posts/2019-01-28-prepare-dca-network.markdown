---
title: Prepare DCA Note - Network
date: 2019-01-28 22:05:00 -06:00
tags:
- docker
layout: post
---

Docker network is based on the Container Network Model where libnetwork is docker's implementation. It provides single-host bridge network, multi-host overlays, options for plugging into existing VLAN, Service discovery and basic container load balancing.
<!--more-->

# CNM
Three build blocks
* Sandboxes - an isolated network stack
* Endpoints - virtual network interface
* Networks - software implementation switch

#libnetwork
* docker implementation and more 
* service discovery, ingress load balance, network control, and management plane

# driver
data plane
## linux 
 * bridge
 * overlay
  * macvlan
## window
  * nat
  * transparent
  * overlay
## 3rd party