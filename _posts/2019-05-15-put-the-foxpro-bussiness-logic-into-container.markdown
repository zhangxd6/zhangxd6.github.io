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
  This requires us to refactor the code to remove all GUI related and compile it into dll.
  ![foxpro.PNG](/uploads/foxpro.PNG)
   
2. Build.Net Asp or Console app as a wrapper

3. Build Container Images
  
    It is a bit tricky to get FoxPro runtime inside the image; we are using mcr.microsoft.com/dotnet/framework/runtime:4.7.2-windowsservercore-ltsc2016 as our base image. The installation package won't execute properly that we have to create a script to add files and registry key in place.

~~~
 # install foxpro run time
Write-Host "Installing FOXPRO 9 Runtime"
# ./VFP9SP2RT.exe /S /X c:\instsall\VFP
Set-Location './VFP'
Move-Item -Path '.\msvcr71.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\msxml3.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\msxml3a.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\msxml3r.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\msxml4.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\msxml4r.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\vfpodbc.dll' -Destination 'C:\Windows\SysWOW64\' -Force -Verbose
Move-Item -Path '.\vfpoledb.dll' -Destination 'C:\Program Files (x86)\Common Files\system\ole db\' -Force -Verbose
Copy-Item -Path '.\' -Destination 'C:\Program Files (x86)\Common Files\Microsoft Shared\VFP\' -Recurse -Verbose


Set-Location 'c:/install'
Write-Host "import reg keys"
reg.exe Import foxpro.reg
~~~