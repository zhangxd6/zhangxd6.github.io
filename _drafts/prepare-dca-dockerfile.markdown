---
title: Prepare DCA - Dockerfile/Composefile
date: 2019-01-21 22:16:00 -06:00
---

Dockerfile/Compose instructions
<!--more-->
# Dockerfile

# Compose
 the default name for the compose YAML file is docker-compose.yml. -f flag can be used for custom filename

## TopLevel

* version - version of compose file format
* services - define application services
* networks - create new networks;default bridge network
* volumes - create new volume

* secrets
* configs 

## services
 * build - Dockerfile location
 * command - main app of container
 * ports - host/container port mapping
 * networks - application attach to which network
 * volumne - mount volumne to container