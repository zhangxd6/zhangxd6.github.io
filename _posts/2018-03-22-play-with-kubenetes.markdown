---
title: Play with Kubenetes - k8s dashbard
date: 2018-03-22 19:33:00 -05:00
tags:
- docker
- kubernetes
layout: post
---


<!--more-->
# 5bday instruction
https://github.com/dockersamples/docker-fifth-birthday/blob/master/kubernetes-desktop.md

# install kubenetes dashboard

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml

# Get account token

kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')

# deploy voting app
kubectl apply -f kube-deployment.yml



