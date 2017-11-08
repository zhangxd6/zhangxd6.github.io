---
title: virtualize your dev environment
date: 2016-06-28 00:00:00 Z
tags:
- vagrant
- dev
layout: post
---

It is crucial for developers to be authoring code and test it in a production-like environment. Asking extra hardware most time costs prohibited route. Fortunately, virtualization and containerization provide developers with sufficient tools to manage this. This post will focus on the Vagrant to establish virtual machines on window os.

<!--more-->

>Create a base box

  following the [instruction](http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-1.html) to set up the base window server 2012 r2 image.
  *note*: you have to enable the VT_X(virtualization) in bios to able to use virtual box

>Add base box

 `vagrant box add WinServerBase C:\Mydata\Virtual\windows_2012_r2_virtualbox.box`

>Start base box
 
  `vagrant init WinServerBase`

  `vagrant up`

  `vagrant rdp`

>Prevision 
  
  you will need to modify the Vagrantfile to provision the virtual box to host the website or other applications, like

` config.vm.provision "shell",path:"installCplusRuntime.cmd"
config.vm.provision :shell, path:"disable-firewall.ps1"`

[^1]: (http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-1.html)
[^2]: (http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-2.html)