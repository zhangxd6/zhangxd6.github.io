---
title: Organize Angular App with projects
date: 2019-02-14 10:23:00 -06:00
tags:
- angular
- archtecture
- frontend
layout: post
---

There are always business requirements changes that will change your application structures. 
<!--more-->
# Background

We have an angular (7) application designed to take advantage of modules and lazy-loading by the angular router to divide the application into couples of functional groups that controlled by user permissions. However, the recent business decision is made to break these separated functional groups into individual product offer that has its own permissions. The requires us to reorganize current code base so that we can better develop, maintain, and support these products.  

# Solution

## App Structure Prior 

The application used modules to encapsulate the functionalities to a particular product and grouped all shared components, services, utilities into shared modules. The routing will help the application decide which module is going to load during the runtime by lazy loading.

```
-- package.json

-- src

   ---- app

    ------ module 1 (functional group/product1)

    ------ module 2 (functional group/product2)

    ------ shared module

    ------ asset

   ---- configs
```

## Updated structure

Since the separated products will be managed by the same team, we use **project** and **library** to reorganize the application (we will refer it as a workspace to align some terminologies in angular).

> [Project](https://angular.io/guide/glossary#project)
> In Angular, a folder within a workspace that contains an Angular app or library. A workspace can contain multiple projects. All apps in a workspace can use libraries in the same workspace.

> [Library](!https://angular.io/guide/libraries)
> When you import something from a library in an Angular app, Angular looks for a mapping between the library name and a location on disk. When you install a library package, the mapping is in the node_modules folder. When you build your own library, it has to find the mapping in your tsconfig paths.

> Generating a library with the Angular CLI automatically adds its path to the tsconfig file. The Angular CLI uses the tsconfig paths to tell the build system where to find the library.

Now we are having

```

|-- package.json

|-- projects

|   |-- product1

|   |-- product2

|   |-- shared library

```
