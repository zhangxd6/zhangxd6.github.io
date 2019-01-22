---
title: Prepare DCA - Storage
date: 2019-01-21 21:22:00 -06:00
---

By default, all files created inside a container are stored on a writable container layer. 

Docker has two options for containers to store files in the host machine, so that the files are persisted even after the container stops: volumes, and bind mounts. If you’re running Docker on Linux you can also use a tmpfs mount.
<!--more-->

#Type

* **Volumes** are stored in a part of the host filesystem which is managed by Docker (/var/lib/docker/volumes/ on Linux). Non-Docker processes should not modify this part of the filesystem. Volumes are the best way to persist data in Docker.

* **Bind** mounts may be stored anywhere on the host system. They may even be important system files or directories. Non-Docker processes on the Docker host or a Docker container can modify them at any time.

* **tmpfs** mounts are stored in the host system’s memory only, and are never written to the host system’s filesystem.

# Use Cases

1. **volumes**
Volumes are the preferred way to persist data in Docker containers and services. Some use cases for volumes include:

* Sharing data among multiple running containers. If you don’t explicitly create it, a volume is created the first time it is mounted into a container. When that container stops or is removed, the volume still exists. Multiple containers can mount the same volume simultaneously, either read-write or read-only. Volumes are only removed when you explicitly remove them.

* When the Docker host is not guaranteed to have a given directory or file structure. Volumes help you decouple the configuration of the Docker host from the container runtime.

* When you want to store your container’s data on a remote host or a cloud provider, rather than locally.

* When you need to back up, restore, or migrate data from one Docker host to another, volumes are a better choice. You can stop containers using the volume, then back up the volume’s directory (such as /var/lib/docker/volumes/<volume-name>).

2.  **Bind**
In general, you should use volumes where possible. Bind mounts are appropriate for the following types of use case:

* Sharing configuration files from the host machine to containers. This is how Docker provides DNS resolution to containers by default, by mounting /etc/resolv.conf from the host machine into each container.

* Sharing source code or build artifacts between a development environment on the Docker host and a container. For instance, you may mount a Maven target/ directory into a container, and each time you build the Maven project on the Docker host, the container gets access to the rebuilt artifacts.

* If you use Docker for development this way, your production Dockerfile would copy the production-ready artifacts directly into the image, rather than relying on a bind mount.

* When the file or directory structure of the Docker host is guaranteed to be consistent with the bind mounts the containers require.

3.  **tmpfs** 

* tmpfs mounts are best used for cases when you do not want the data to persist either on the host machine or within the container. This may be for security reasons or to protect the performance of the container when your application needs to write a large volume of non-persistent state data.


# command

```
 docker volume create
 docker volume rm
 docker volume prune
 docker volume inspect
```

## flag -v or --mount 

Originally, the -v or --volume flag was used for standalone containers and the --mount flag was used for swarm services. However, starting with Docker 17.06, you can also use --mount with standalone containers. In general, --mount is more explicit and verbose. The biggest difference is that the -v syntax combines all the options together in one field, while the --mount syntax separates them. Here is a comparison of the syntax for each flag.

New users should try --mount syntax which is simpler than --volume syntax.
If you need to specify volume driver options, you must use --mount.

-v or --volume: Consists of three fields, separated by colon characters (:). The fields must be in the correct order, and the meaning of each field is not immediately obvious.
* In the case of named volumes, the first field is the name of the volume and is unique on a given host machine. For anonymous volumes, the first field is omitted.
* The second field is the path where the file or directory are mounted in the container.
* The third field is optional and is a comma-separated list of options, such as ro. These options are discussed below.

--mount: Consists of multiple key-value pairs, separated by commas and each consisting of a <key>=<value> tuple. The --mount syntax is more verbose than -v or --volume, but the order of the keys is not significant, and the value of the flag is easier to understand.
* The type of the mount, which can be bind, volume, or tmpfs. This topic discusses volumes, so the type is always volume.
* The source of the mount. For named volumes, this is the name of the volume. For anonymous volumes, this field is omitted. May be specified as source or src.
* The destination takes as its value the path where the file or directory is mounted in the container. May be specified as destination, dst, or target.
* The readonly option, if present, causes the bind mount to be mounted into the container as read-only.
* The volume-opt option, which can be specified more than once, takes a key-value pair consisting of the option name and its value.

# Storage and Layer

* layer
* size and virtual size
* copy on write

#storage diriver
##Linux 
* autofs
* overlay2
* devicemapper 
* others
##Windows
* widnowsfilter
* lcow