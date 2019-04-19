---
title: Prepare DCA note - container
date: 2019-02-17 14:28:00 -06:00
tags:
- docker
layout: post
---

Run container in production
<!--more-->

# Start Container Automatically

## container has restart policy

~~~
  docker run --restart 'policy' redis
~~~

|flag|Description|
|:--|:--|
|no|no auto restart|
|no-failure|only on non-zero exit code|
|always|restart it if it is stopped|
|unless-stopped| similar to always, but not restart when daemon restarts|

## difference --live-restore flag of *dockerd* 
  the flag allows keeping container running during a docker upgrade, though networking and user input is interrupted

The live restore option only works to restore containers if the daemon options, such as bridge IP addresses and graph driver, did not change. If any of these daemon-level configuration options have changed, the live restore may not work and you may need to manually stop the containers.

## Note
1. A restart policy only takes effect after it starts successfully meaning it is up more than 10 seconds
2. if it is manually stopped, its restart policy is ignored until daemon restart or container manually restarted.
3. restart policy only applies to containers. 


# Run multiple services in a container
1. recommend a service per container
2. the container main process is responsible for managing all processes. 
3. can user --init option to insert a tiny init-process to the container as the main process

# Container stats

~~~
  docker stats
~~~

# limit a container's resources
 By default, a container can use as much of resource as host allows.