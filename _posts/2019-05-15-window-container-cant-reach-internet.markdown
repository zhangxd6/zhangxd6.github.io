---
title: Window Container can't reach internet
date: 2019-05-15 14:35:00 -05:00
tags:
- docker
- windows container
layout: post
---

I switched between stable and edge version of Docker for Windows. Apparently, I did something that my windows containers lost internet connection.
<!--more-->
 It took me about a day and then find this issue in the github,[Windows containers can't access the internet](https://github.com/docker/for-win/issues/2760#issuecomment-430889666). 

1. Check the interfaceMeric

~~~
Get-NetIPInterface -AddressFamily IPv4 | Sort-Object -Property InterfaceMetric -Descending
~~~

2. make sure the primary network adapter has the lowest number

~~~
Set-NetIPInterface -InterfaceAlias 'Wi-Fi' -InterfaceMetric 3
~~~
[interfacemetric.PNG](/uploads/interfacemetric.PNG)
