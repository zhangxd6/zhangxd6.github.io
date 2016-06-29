---
layout: default
title: Logging to your log aggreator for azure service fabric
---

Azure service fabric uses Event Tracgin for Windows(ETW) for its logging. If you deploy your cluster to the Microsoft cloud, then it can report data to azure storage via azure
diagnostic. What if you are using diffenet log aggeragators, for instance elasticsearch or splunk, to ingest your logs. Well the short answer is you have to create a service to redirect events.

<!--more-->

I will describe two services here, one is what I came up before I realized microsoft provide the sample, which is the 2nd service.

1. Using NLog with customerized target

2. Using Microsoft.Diagnostic.Listener library


