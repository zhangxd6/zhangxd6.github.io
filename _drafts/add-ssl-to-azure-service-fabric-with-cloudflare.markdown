---
title: Add SSL to Azure Service Fabric with CloudFlare
date: 2018-02-19 22:45:00 -06:00
tags:
- azure service fabric
- ssl
- cloudflare
---

Got idea from 
https://kvaes.wordpress.com/2016/11/09/azure-a-poor-mans-ssl-termination-by-leveraging-cloudflare/


1. add CNAME(app) to DNS use service fabric DNS name as an alias
2. Enable SSL to flexible
3. Turn on always use HTTPS
4. Turn on Automatic HTTPS Rewrite
5. Add NSG to service fabric cluster
6. Add inbound rules to only allow traffic from Cloudflare [](https://www.cloudflare.com/ips-v4)