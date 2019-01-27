---
title: Prepare DCA  - Commands
date: 2019-01-07 15:12:00 -06:00
---

<!--more-->
# Engine
```
docker system 
df -disk usage 
events - real-time event 
info - system-wide info
prune - remove unused data - all stopped container, unsued network dangling images and cache.
```
[system](https://docs.docker.com/edge/engine/reference/commandline/system/)

#Image
```
  docker image ls --digests // see SHA256 of images
  docker image ls --filter reference="*:latest"
  docker image ls --filter dangling=true
  docker inspect
  docker 
```

# container
```
  docker run --restart alway/unless-stopped/on-failed
```

# docker-compose
```
 docker-compose up -d
 docker-compose down
 docker-compose ps
 docker-compose top
 docker-compose stop
 docker-compose restart
```
