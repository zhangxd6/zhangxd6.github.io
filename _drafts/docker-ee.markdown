---
title: Docker EE
date: 2018-04-28 11:39:00 -05:00
---

local cluster via Vagrant
```
manager_ip = "10.0.3.2"

Vagrant.configure(2) do |config|

  config.vm.define "manager" do |manager|
    manager.vm.hostname = "manager"
    manager.vm.box = "ubuntu/trusty64"
    manager.vm.network "private_network", ip: manager_ip

    manager.vm.provider "virtualbox" do |v|
      v.cpus = 1
      v.memory = 512
    end
  end

  (1..2).each do |i|
    config.vm.define "worker-#{i}" do |worker|
      worker.vm.hostname = "worker-#{i}"
      worker.vm.box = "ubuntu/trusty64"
      worker.vm.network "private_network", ip: "10.0.3.#{i+2}"

      worker.vm.provider "virtualbox" do |v|
        v.cpus = 1
        v.memory = 512
      end
    end
  end
end
```