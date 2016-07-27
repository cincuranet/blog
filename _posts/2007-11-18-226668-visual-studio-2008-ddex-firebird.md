---
title: "Visual Studio 2008, DDEX, Firebird"
date: 2007-11-18T10:14:00Z
tags:
  - Firebird
  - Visual Studio
redirect_from: /id/226668/
layout: post
---
Yes, it's here. A small taste for start:

![image]({{ site.address }}/i/226668/226668.png)

OK. There was some questions about "how to use DDEX provider for FB in VS2008". Yesterday I had piece of time, so I've decided to try to install into VS2008 the DDEX provider. It has been working like a charm. I've been doing steps like in any other installation <small>[GAC, machine.config, registry]</small> and just changed few values in registry (using "stable" build of DDEX available on sourceforge). Nothing tricky.

I'll commit to SVN new registry files as soon as possible, so it will be available for you. And I'll also try to to create new DDEX version with described installation for both VS2005 and VS2008.