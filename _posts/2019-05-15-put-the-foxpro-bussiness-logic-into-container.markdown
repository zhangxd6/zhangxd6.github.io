---
title: Put the Foxpro bussiness logic into Container
date: 2019-05-15 08:45:00 -05:00
tags:
- docker
- foxpro
- legacy
layout: post
---

Visual FoxPro Version 9.0, released in December 2004 and updated in October 2007 with the SP2 patch, was the final version of the product.  The support of Version 9 ended on January 13, 2015. Yet There is a lot of business logic to be migrated to newer technologies. This post is about the approach we took to move the logic into containers as an intermediate step.

<!--more-->
1. Compile fox code as DLL

2. Build.Net Asp or Console app as a wrapper

3. Build Container