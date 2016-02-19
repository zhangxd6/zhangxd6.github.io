---
layout: default
title: virtualize your dev environment
---



Pre1: following the instruction part 1 to set up the base win2012 image or contact me with prebuilt box 
  *note*: you have to enable the VT_X(virtualization) in bios to able to use virtual box

<!--more-->

Now we have the base box C:\Mydata\Virtual\windows_2012_r2_virtualbox.box

>Add base box

 `vagrant box add WinServerBase C:\Mydata\Virtual\windows_2012_r2_virtualbox.box`

>Start base box
 
  `vagrant init WinServerBase`

  `vagrant up`

  `vagrant rdp`

>Prevision 
  
  you wil need to modify the Vagrantfile to provision the vm to host the website or other applications

> SQL Box
  
  enable .net 3.5 feature 

`import-module servermanager
echo "Enabling .NET Framework"
add-windowsfeature as-net-framework`

  install sql server

`echo Installing SQL Server 2014 R2, it will take a while...
C:\vagrant\software\sql2014\Setup.exe /Q /Action=install /INDICATEPROGRESS /IAcceptSQLServerLicenseTerms /FEATURES=SQL /TCPENABLED=1 /SECURITYMODE="SQL" /SAPWD="#SAPassword!"
echo Disabling firewall
netsh advfirewall set allprofiles state off
echo Done!`


[^1]: (http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-1.html)
[^2]: (http://www.developer.com/net/virtualize-your-windows-development-environments-with-vagrant-packer-and-chocolatey-part-2.html)
