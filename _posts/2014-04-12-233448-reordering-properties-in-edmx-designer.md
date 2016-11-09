---
title: "Reordering properties in EDMX designer"
date: 2014-04-12T07:56:00Z
tags:
  - Entity Framework
  - Visual Studio
layout: post
---
I don't remember when people started begging [EF team][1] to add support for reordering properties in EDMX designer. I think I first found the need around 2008. :) I hoped, guessing it's a simple feature, to have it in some update to EF1. Sadly not. Only option, though simple, was to open the EDMX as a XML file and change the order of properties in CSDL part.

<!-- excerpt -->

Until now. Yes it took few years, few major Entity Framework versions, but it's finally there. But you might not know, as I didn't. Until we found it this week while I was teaching my [Entity Framework course][2]. If you install [Entity Framework 6.1 tooling][3] you will get the new consolidated (Code First together with EDMX) tools/designer and some features previously available in EF Power Tools. When I installed it, I tried to reorder the properties using mouse and it didn't worked. So I concluded it's still ;) not there.

But then we found it. You have to actually right click on a property and then there's a menu to move it up or down (and also bigger steps). It even works with keyboard - `Alt+Up` or `Alt+Down` respectively, for the start. Nice! I'm more keyboard/console guy so I don't mind missing "mouse support" (although I can imagine some people will find the current implementation incomplete).

There you have it. If you're not actually reading the menus carefully and just clicking on familiar words as I do you might have missed it.

[1]: http://entityframework.codeplex.com
[2]: http://www.x2develop.com
[3]: http://www.microsoft.com/en-us/download/details.aspx?id=40762