---
title: Add SSL to Azure Service Fabric with CloudFlare
date: 2018-02-19 22:45:00 -06:00
tags:
- azure service fabric
- ssl
- cloudflare
---

Use CloudFlare to add SSL to Azure Service Fabric Application

<!--more-->


1. add CNAME(app) to DNS use service fabric DNS name as an alias
 ![DNSalias.png](/uploads/DNSalias.png)
2. Enable SSL to flexible
![SSL1.png](/uploads/SSL1.png)
3. Turn on always use HTTPS
![SSL3.png](/uploads/SSL3.png)
4. Turn on Automatic HTTPS Rewrite
![SSL2.png](/uploads/SSL2.png)
5. Add NSG to service fabric cluster
![NSG_-_Microsoft_Azure.png](/uploads/NSG_-_Microsoft_Azure.png)
6. Add inbound rules to only allow traffic from Cloudflare [](https://www.cloudflare.com/ips-v4)

Credit goes
https://kvaes.wordpress.com/2016/11/09/azure-a-poor-mans-ssl-termination-by-leveraging-cloudflare/