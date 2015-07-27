---
title: "Settings and IList"
date: 2006-07-17T21:05:00Z
tags:
  - .NET
redirect_from: /id/8683/
category: none
layout: post
---
Today I needed to save to configuration `IList<string>`. I tried the browse dialog of settings tab (the "dialog" when you double-click on settings file, I have no idea whether it has any special name). But what was the surprise, when I was unable to add item with this type. I was traversing dialogs and trying to hack it to allow me add `System.Collections.Generics.IList<string>`.

But the solution was really easy. I've just edited the files by hand and everything was OK. So my advice is not to trying convince the type selection dialog, but take the bit in one's teeth - quick&dirty. :)
