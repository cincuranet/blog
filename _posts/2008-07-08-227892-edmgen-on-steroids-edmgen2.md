---
title: "EdmGen on steroids? EdmGen2!"
date: 2008-07-08T21:01:00Z
tags:
  - Entity Framework
layout: post
---
The EdmGen tool available in Entity Framework or simply SP1 installation is good tool for playing with CSDL, SSDL and MSL files. On the other hand, when using Visual Studio you get all these files in one EDMX file. Though it's just a pack of these two files, you cannot use it as input/output for EdmGen.

Fortunately there's a solution - [EdmGen2][1]. It's simply EdmGen on steroids. :) EdmGen2 can read and write EDMX files and also translate between EDMX and CSDL, SSDL and MSL files. The source code is also available, so you can use sources as learning material to API in System.Data.Entity.Design.

[1]: http://code.msdn.microsoft.com/EdmGen2