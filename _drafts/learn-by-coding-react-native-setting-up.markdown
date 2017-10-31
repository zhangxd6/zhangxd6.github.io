---
title: 'Learn by coding: React Native - Setting up'
date: 2017-10-31 02:50:00 Z
tags:
- react-native
- mobile
layout: post
---

I am a fan of Angular. When it comes down to develop mobile applications, I always turn to the ionic framework for the benefit of leveraging my HTML and javascript knowledge. I heard the react framework from Facebook for quite awhile and I was turned off by JSX syntax until recently. I love the promise of virtual dom and immutable state. At the same time, there is a need to build a mobile application for code camp I am volunteering. So I decided to take the challenge to learn the react native and try to take notes during the process. This is the first one: setting up.

<!--more-->

Preparing the dev environment for react-native is a relatively straightforward process by following the Facebook get started documentation at [here](/https://facebook.github.io/react-native/docs/getting-started.html).

Now I need a start point for the project. And my another favorite is the [Typescript](https://www.typescriptlang.org/). I have been using it for my work and really love the static code analysis, the lastest and evolving javascript features and the ability to target the older version of javascript. 

So here are my two requirements 
* a starter boilerplate
* the ability to use Typescript

I could have used the 
```
  create-react-native-app
```
or
```
  react-native-cli
```
as Facebook includes in the documentation. However, my googling gave me another choice 
```
   ignite-cli
```
It is created by [InfiniteRead](https://github.com/infinitered/ignite) and I like the example app they created for Chain React conference. There are many excellent react-native boilerplate tools. The Ignite is my choice to create the boilerplate project.

## Create New Project

So Let's bring up the terminal.
```
   npm install -g ignite-cli
```
This is going to install the ignite globally.

```
  ignite new MyStarterProject
```
Now I have a new react-native project after I answer a couple of questions prompted.

```  
  cd MyStarterProject
  react-native run-ios
```
Here it is, the first react-native app running in the iOs simulator.

## Setup Typesctipt



