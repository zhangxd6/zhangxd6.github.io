---
title: Prepare DCA Note - label
date: 2019-02-11 18:28:00 -06:00
tags:
- dcoker
---

Labels are a way to apply metadata to Docker object
<!--more-->

# Key 
 * alphanumeric string may have . or -
 * lowercase
 * . separates the namespace
# Value
 * any type can be represented as a string

# Management
 * labels on images, containers, local daemons, volumes, and networks are static for the lifetime of the object.
 * docker swarm nodes and service can update label dynamically.

## image and container
 * Dockerfile - LABEL instruction 
   - LABEL <key>=<value> <key>=<value>
 * runtime
``` 
 docker run -l empty-label --label com.example.foo=bar ubuntu bash
 docker run --label-file ./labels ubuntu bash
```
 * filter label
```
  docker images --filter "key=value"
  docker ps --filter "key=value"
```