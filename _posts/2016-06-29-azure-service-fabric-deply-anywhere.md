---
title: azure service fabric deploy anywhere
date: 2016-06-29 00:00:00 Z
tags:
- azure
- microservice
- azure service fabric
layout: post
---

This post I will discuss the setup I used for my research on Microsoft azure service fabric on premise.

<!--more-->

I don't have the luxury to have multiple computers readily available so I route to use virtual machines that I can spin off on my box where I have 32G memory that is enough for 3 nodes with minimum
configuration recommended by Microsoft. Naturally, the *Vagrant* is my choice since the windows server dependence.

## Preparation

First of all, I have to a window base box. I created a base box based on windows server 2012 r2 using a tool called *packer*.  The [blog](http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-1.html) is the good resource to get it setup

## Cluster setting

For my testing, I opted for the simplest cluster which includes 3 nodes spreading into 3 update domains and fault domains. The service bus provides the load balance inside its services, however, a 
external load balancer needed for any traffic outside to communicate with service fabric applications, which I assume all communication happens through APIs via HTTP.

Now the code/scripts.

## Vagrantfile

we need 3 vms

~~~
    (1..3).each do |i|
    root.vm.define "node-#{i}" do |config|
    end
~~~

that are derived for my base box named *WinServerBase* and provide default user 

~~~
        config.vm.box = "WinServerBase"
        config.vm.communicator = "winrm"

        config.winrm.username = "vagrant"
        config.winrm.password = "vagrant"

        config.vm.guest = :windows
        config.windows.halt_timeout = 15
~~~


let's set the network

~~~
        config.vm.network :forwarded_port, guest: 3389, host: 3389, id: "rdp", auto_correct: true
        config.vm.network :forwarded_port, guest: 22, host: 2222, id: "ssh", auto_correct: true

        config.vm.hostname="node#{i}"
        config.vm.network "private_network", ip: "192.168.100.#{i}0" ,virtualbox__intnet: true
~~~

it is turn for adjusting the vm

~~~
        config.vm.provider "virtualbox" do |vb|
            vb.memory = "2048"         
            vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
            vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        end
~~~

now we don't want to install runtime manually for provision vms

~~~
        config.vm.provision "shell",path:"installCplusRuntime.cmd"
        config.vm.provision :shell, path:"disable-firewall.ps1"
        if i==3
           config.vm.provision :shell, path:"configure-cluster.ps1"
        end
~~~

here we disable the firewall altogether, install the c++ run-time. Once the last vm is up, we start the setup of azure service fabric cluster


Did you forget the load balancer? No, here is it. I chose haproxy on a Ubuntu.

~~~
oot.vm.define "loadbalancer" do |ubuntu|
        ubuntu.vm.box="ubuntu/trusty64"
        ubuntu.vm.communicator ="ssh"
        ubuntu.vm.network "private_network", ip: "192.168.100.1" ,virtualbox__intnet: true
        
        ubuntu.vm.network :forwarded_port, guest:8898, host:18898,id:"apiGateWay",auto_correct:true
        ubuntu.vm.network :forwarded_port, guest:19080, host:18080,id:"httpGateWay",auto_correct:true
        ubuntu.vm.network :forwarded_port, guest:19000, host:18000,id:"clientconnectionEndpoint",auto_correct:true
        ubuntu.vm.network :forwarded_port, guest:8081, host:18081,id:"clusterStatus",auto_correct:true
        ubuntu.vm.network :forwarded_port, guest:80, host:18888,id:"http",auto_correct:true
        ubuntu.vm.network :forwarded_port, guest:1936, host:11936,id:"haproxy",auto_correct:true

        ubuntu.ssh.insert_key = false
        $script = <<SCRIPT
        add-apt-repository ppa:vbernat/haproxy-1.5
        apt-get update
        echo 'install haproxy'
        apt-get install haproxy
        cp /vagrant/haproxy.cfg /etc/haproxy/haproxy.cfg
        service haproxy restart
SCRIPT
        ubuntu.vm.provision "shell", inline: $script
   end
~~~

## Get cluster up

now show time!

~~~
   vagarnt up
~~~

I did not include other scripts that you can find at this [gist](https://gist.github.com/zhangxd6/d5017c706375b6ce1c4e5c83da0c5c12)


