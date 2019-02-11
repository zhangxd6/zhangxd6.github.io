---
title: Prepare DCA Note - Stack
date: 2019-02-03 15:02:00 -06:00
tags:
- docker
layout: post
---

Docker stack simplifies the application management by providing: desired state, rolling updates, simple, scaling operation, health checks.
<!--more-->
#Simple Process
 Define app in Compose file and deploy and manage it with 
```
  docker stack deploy
  cat docker-compose.yml | docker stack deploy --compose-file - vossibility
```
