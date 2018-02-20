---
title: Create Client Certificate for Azure Service Fabric
date: 2018-02-19 20:52:00 -06:00
tags:
- azure service fabric
- certificate
---

1. Create the Azure service fabric cluster from portal
2. select the basic on security, where the server certificate will be created by portal and stored in the keyvalut
3. go to the keyvault and download the generated server certificate to local.
4. open powershell
```
 Get-ChildItem -Path "Cert:\LocalMachine\CA" 
``` 
get the list of certificates and find the generated server certificate and note the thumbprint and subject

```
 $cert = Get-ChildItem -Path "Cert:\LocalMachine\CA\Thumbprint" 
```
load the cert to variable $cert

```
 New-SelfSignedCertificate -Type Custom -KeySpec Signature `
-Subject "CN=eastus.cloudapp.azure.com" -KeyExportPolicy Exportable `
-HashAlgorithm sha256 -KeyLength 2048 `
-CertStoreLocation "Cert:\CurrentUser\My" `
-Signer $cert -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2") 
```
create client certificate
5. export the client certificate to local pfx
6. generate base64 version. [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("C:\users\userid\Documents\pandaciclient.pfx")) 


