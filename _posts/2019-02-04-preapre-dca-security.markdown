---
title: Preapre DCA Note - Security
date: 2019-02-04 22:01:00 -06:00
tags:
- docker
layout: post
---

Security is all about layers.
<!--more-->

# Linux security tech

## namespace - isolation

  * process ID - PID 1 on every container
  * Network - container's own isolated network
  * mount - / filesystem
  * IPC - for share memory access and isolates from shared memory outside the container
  * user - map different user inside and host
  * UTS - provide a hostname

## Control Group (cgroup) - setting limit

## Capabilities - allow container run as root but limit the root capabilities

## MAC system - Mandatory Access Control system

## seccomp - filter node t0 limit the syscalls a container can make to the host

#Docker Security

## Swarm Mode

  * Cryptographic node IDs
  * Mutual authentications via TLS
  * Secure join token
  * CA configuration with auto certificate rotation
  * Encrypted cluster store
  * Encrypted networks

## Docker Security Scan

  * Binary-level scan against CVE database
  * Docker Trusted Registry has the scan

## Docker Content Trust

  * sign image when push
  * verify image when pulling
  * enable sign

~~~
  export DOCKER_CONTENT_TRUST=1
~~~
  * once DCT enabled, you won't be able to pull and work with unsigned images

## Docker Secrets

 * secrets are encrypted at rest, in-flight, mounted in the in-memory filesystem, and operate under a least-privilege model
 * docker secret sub-command
 * attach secrets to service by --secret flag to the 

~~~
docker service create
~~~

# Secure client and daemon communication

1. create a CA private key and public key (certificate)
2. Create daemon and client key pair
3. configure daemon by updating daemon.json plus have daemon key pair and CA certificate 
4. configure the client by having client key pair and CA certificate and environment variable  DOCKER_HOST AND DOCKER_TLS_VERIFY=1
