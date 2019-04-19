---
title: Prepare DCA Note - Registry
date: 2019-02-24 14:51:00 -06:00
tags:
- docker
layout: post
---

Docker Registry
<!--more-->

# Why use it

* tightly control where your images are being stored
* fully own your images distribution pipeline
* integrate image storage and distribution tightly into your in-house development workflow

# Usage
~~~
   docker run -d -p 5000:5000 --name registry registry:2
   docker image tag uimage localhost:5000/firstimage
   docker push localhost:5000/firstimage
   docker pull localhost:5000/firstimage
~~~ 

# Image Naming

~~~
   docker pull myregistrydomain:port/foo/bar
~~~

# externally-accessible registry

1. get Cert
2. stop registry if it is running
3. restart it

~~~
 docker run -d \
  --restart=always \
  --name registry \
  -v "$(pwd)"/certs:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  -p 443:443 \
  registry:2
~~~
   
# Run registry as swarm service
1. save the TLS certificate and key as secrets:
2. label node

~~~
docker node update --label-add registry=true node1
~~~

3 start service

~~~
docker service create \
  --name registry \
  --secret domain.crt \
  --secret domain.key \
  --constraint 'node.labels.registry==true' \
  --mount type=bind,src=/mnt/registry,dst=/var/lib/registry \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/run/secrets/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/run/secrets/domain.key \
  --publish published=443,target=443 \
  --replicas 1 \
  registry:2
~~~

# Config Registry
## Version
## log to stdout
## hooks logging hook behavior
## storage only one backend 
## auth


# Sign the image
https://docs.docker.com/engine/security/trust/content_trust/
