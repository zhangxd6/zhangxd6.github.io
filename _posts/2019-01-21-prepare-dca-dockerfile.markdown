---
title: Prepare DCA Note - Dockerfile/Composefile
date: 2019-01-21 22:16:00 -06:00
tags:
- docker
layout: post
---

Dockerfile/Compose instructions
<!--more-->
# Dockerfile

## buildkit
  >DOCKER_BUILDKIT=1
## Environment replacement
Environment variables are notated in the Dockerfile either with $variable_name or ${variable_name}
* ${variable:-word} indicates that if a variable is set then the result will be that value. If a variable is not set then word will be the result.
* ${variable:+word} indicates that if a variable is set then word will be the result, otherwise the result is the empty string.

Escaping is possible by adding a \ before the variable: \$foo or \${foo}, for example, will translate to $foo and ${foo} literals respectively.

## ENTRYPOINT
You can specify a plain string for the ENTRYPOINT and it will execute in /bin/sh -c. This form will use shell processing to substitute shell environment variables and will ignore any CMD or docker run command line arguments. To ensure that docker stop will signal any long-running ENTRYPOINT executable correctly, you need to remember to start it with exec
Understand how CMD and ENTRYPOINT interact
Both CMD and ENTRYPOINT instructions define what command gets executed when running a container. There are few rules that describe their co-operation.

Dockerfile should specify at least one of CMD or ENTRYPOINT commands.

ENTRYPOINT should be defined when using the container as an executable.

CMD should be used as a way of defining default arguments for an ENTRYPOINT command or for executing an ad-hoc command in a container.

CMD will be overridden when running the container with alternative arguments.

The table below shows what command is executed for different ENTRYPOINT / CMD combinations:

 	No ENTRYPOINT	ENTRYPOINT exec_entry p1_entry	ENTRYPOINT [“exec_entry”, “p1_entry”]
No CMD	error, not allowed	/bin/sh -c exec_entry p1_entry	exec_entry p1_entry
CMD [“exec_cmd”, “p1_cmd”]	exec_cmd p1_cmd	/bin/sh -c exec_entry p1_entry	exec_entry p1_entry exec_cmd p1_cmd
CMD [“p1_cmd”, “p2_cmd”]	p1_cmd p2_cmd	/bin/sh -c exec_entry p1_entry	exec_entry p1_entry p1_cmd p2_cmd
CMD exec_cmd p1_cmd	/bin/sh -c exec_cmd p1_cmd	/bin/sh -c exec_entry p1_entry	exec_entry p1_entry /bin/sh -c exec_cmd p1_cmd
Note: If CMD is defined from the base image, setting ENTRYPOINT will reset CMD to an empty value. In this scenario, CMD must be defined in the current image to have a value.

## ARG
An ARG declared before a FROM is outside of a build stage, so it can’t be used in any instruction after a FROM. To use the default value of an ARG declared before the first FROM use an ARG instruction without a value inside of a build stage:

# Compose
 the default name for the compose YAML file is docker-compose.yml. -f flag can be used for custom filename

## TopLevel

* version - version of compose file format
* services - define application services
* networks - create new networks; default bridge network
* volumes - create a new volume

* secrets
* configs 

## services
 * build - Dockerfile location
 * command - main app of container
 * ports - host/container port mapping
 * networks - application attach to which network
 * volumne - mount volumne to container