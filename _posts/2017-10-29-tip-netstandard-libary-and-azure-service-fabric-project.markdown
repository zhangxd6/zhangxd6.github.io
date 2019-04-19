---
title: ".Netstandard Libary and Azure service fabric project"
date: 2017-10-28 19:13:00 -05:00
tags:
- microservice
- azure service fabric
- ".netstandard"
- tip
layout: post
---

Microsoft recently released .netstandard 2.0, which is a huge step forward in term of API surface, which includes almost all the API in the full .net framework. I had pain trying to move my .net libraries to the earlier version of the standard. It is indeed a lot smoother this time. For my Azure Service Fabric project, I still need a few manual modifications since the tooling support is not readily available yet.

<!--more-->

The current template for creating service of a service fabric project is still using old csproject format. Therefore you will get compiling error when you are trying to reference a dll targeted .netstandard. After research, it turns out the solution is to change your csporject to the new format manually.

~~~
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net461</TargetFramework>
    <RuntimeIdentifier>win7-x64</RuntimeIdentifier>
    <IsServiceFabricServiceProject>True</IsServiceFabricServiceProject>
    <ApplicationIcon />
    <OutputType>Exe</OutputType>
    <StartupObject />
  </PropertyGroup>

  <ItemGroup>
    <Compile Remove="Properties\AssemblyInfo.cs" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Engine.Core" Version="1.0.0-CI-20171023-204453" />
    <PackageReference Include="Microsoft.ServiceFabric.Actors" Version="2.8.219" />
    <PackageReference Include="Microsoft.ServiceFabric.Services.Remoting" Version="2.8.219" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Fabric.Contract\Fabric.Contract.csproj" />
  </ItemGroup>
</Project>
~~~