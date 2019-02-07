---
title: Preapre DCA Note - Security
date: 2019-02-04 22:01:00 -06:00
---

Security is all about layers.
<!--more-->

# linux security tech

## namespace - isolation
  * process ID - PID 1 on every container
  * Network - container's own isolated network
  * mount - / filesyste
  * IPC - for share memory access and iosloates from shared memory outside the container
  * user - map different user inside and host
  * UTS - provide hostname

## Control Group (cgroup) - setting limit
## Capabilities - allow caonters run as root but limit the root capabilities
## MAC system - Mandatory Access Control system
## seccomp - filter node t0 limit the syscalls a container can make to the host

#Docker Security

## Swarm Mode
  * Cryptographic node IDs
  * Mutual authentications via TLS
  * Secure join token
  * CA configuration with auto cerificate rotation
  * Encrypted clust store
  * Encrypted networks
## Docker Security Scan
  * Binary-level scan against CVE database
  * Docker Trusted Registry has scan
## Docker Content Trust
  * sign image when push
  * verify image when pull
  * enable sign
```
  export DOCKER_CONTENT_TRUST=1
```
  * once DCT enabled, you won't be able to pull and work with unsigned images
## Docker Secrets
 * secrets are encrypted at rest, in-flight, mounted in in-memory filesystem, and operate under a least-privilege model
 * docker secret sub-command
 * attach secrets to service by --secret flag to the 
```
docker service create
```
