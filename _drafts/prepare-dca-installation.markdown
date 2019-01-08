---
title: Prepare DCA - Installation
date: 2019-01-08 13:52:00 -06:00
---

<!--more-->

# Docker for window
# Docker for Mac
# Docker for Linux
 ```
  wget -q0 https://get.docker.com |sh
 ```
  ## add user to docker group
```
  sudo usermod -aG docker username
```
# Docker for Window server 2016
```
   Install-Module DockerMsftProvider -Force
   Install-Package Docker -ProviderName DockerMsftProvider -Force
```
# Update Linux
```
   sudo apt-get update
   sudo apt-get remove docker docker-engine docker-ce docker.io -y
   wget -q0 https://get.docker.com |sh
   systemctl enable docker
```

#update window server
```
uninstall-module DockerMsftProvider -Force
install-module DockerMsftProvider -Force
install-package docker -providername dockermsftprovider -Update -force
```