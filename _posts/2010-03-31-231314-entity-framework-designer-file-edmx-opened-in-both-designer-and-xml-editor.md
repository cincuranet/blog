---
title: "Entity Framework Designer file (EDMX) opened in both designer and XML Editor"
date: 2010-03-31T11:32:19Z
tags:
  - Entity Framework
  - Visual Studio
redirect_from: /id/231314/
category: none
layout: post
---
I'm using a lot of features from Entity Framework. In fact I think sometimes I'm abusing some features or pushing these to limits. Due to this, I'm often using designer as well as directly editing the XML (maybe if I could do "Update Model from Database" I would use XML almost all the time). But it's a pain to be forced to close the designer when opening the file in XML Editor and vice versa.

Luckily there's a solution. Open another instance of Visual Studio, there open the file in one "view" and the other "view" open in your solution as normal. When you change your file in one instance, the Visual Studio on the other will detect it and you can reload the file.

This will save me (and hopefully you) couple of unneeded clicks.
