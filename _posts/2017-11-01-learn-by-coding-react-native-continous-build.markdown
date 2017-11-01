---
title: 'Learn by coding: React-Native - Continous Build'
date: 2017-11-01 18:11:00 Z
tags:
- react-native
- mobile
- mobile center
- continuous integration
---

Nowadays, the continuous integration becomes the best practice of building software. In [last blog ](https://www.zhresearches.com/2017/10/31/learn-by-coding-react-native-setting-up.html), we created the starter react-native project. We will create the continuous integration using Mircosoft Mobile Center.
<!--more-->
##Mircosoft Mobile Center
Visual Studio Mobile Center is to
> Bring your apps written in any language to Visual Studio Mobile Center’s cloud and lifecycle services and you’ll get faster release cycles, higher-quality apps, and the time and data to focus on what users want.
It automates the build, testing, distribution, monitoring, and engagement of mobile application development. 
##Set up Continuous Build
1. Login in www.mobile.azure.com with your account or you can create one there.
2. Once login, Click the **Add New** button to chose **Add New App*
3. You will be asked to fill out Name and OS and we will choose ReactNative as its Platform
4. Once you confirmed your selection, you will be shown the instruction to add mobile Center to your app.
5. Now select **Build** on your left side menu.
6. Choose where your project source code is. You can select from VSTS, GitHub, and Bitbucket.
7. Continue with steps, you will choose the repository and branch and then build configuration. The default setting will be sufficient.

Now you should have your build configured. If your build is configured as 
>Build this branch on every push
your next check-in will trigger the automatic build. 

Congratulations on your Continous Build!