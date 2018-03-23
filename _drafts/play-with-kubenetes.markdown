---
title: Play with Kubenetes
date: 2018-03-22 19:33:00 -05:00
tags:
- docker
- kubernetes
---


<--more-->
https://github.com/dockersamples/docker-fifth-birthday/blob/master/kubernetes-desktop.md


kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml


kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')


kubectl apply -f kube-deployment.yml



