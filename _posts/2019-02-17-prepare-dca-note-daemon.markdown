---
title: Prepare DCA Note - Daemon
date: 2019-02-17 14:17:00 -06:00
tags:
- docker
layout: post
---

The `dockerd` daemon is the core of docker. 
<!--more-->

# start the daemon

## automatically
 * default installation will configure daemon start automatically
 * Linux (systemd) 
~~~
  sudo systemctl enable docker
  sudo systemctl disable docker
~~~
 * docker is automatically configured using `upstart`.

 ## manually
~~~
  dockerd
~~~

# Configure the docker daemon
1. Json configureation file 
   `/etc/docker/daemon.json' or
   `c:\progarmdata\docker\daemon.json`
2. flag
   
# Daemon directory
 * /etc/lib/docker
 * c:\programdata\docker
 * can configure it with `data-root` flag