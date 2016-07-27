---
title: "Another progress on Entity Framework provider for Firebird"
date: 2008-07-13T20:17:00Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - LINQ
redirect_from: /id/227904/
layout: post
---
Today, after some days/weeks, I finally created some noticable (= not only internals) progress with Entity Framework provider for Firebird.

Now, the provider is able to use, map, call, ... stored procedures (and functions [very experimental]). You can select stored procedures from database, map these to some operations in EF, create "function imports" etc. You can see this working on picture:

![image]({{ site.address }}/i/227904/227904.png)

I have not tested all available options of calling etc. SPs, so feel free to report any problems with it. Current version can be downloaded from [netprovider.cincura.net (aka weekly builds)][1].

<small>Also take into account, that current latest stable (old ones too) version of FB has `left outer join` bug, so all columns in table are marked as primary key(s) (and so must be not null). I'm wondering how this (from my POV) really serious bug can go thru QA tests?!</small>

Known Issue: When you select "Update Model from Database" in Visual Studio you get error. I'm now working on it.

Anyway for testing, I recommend you to use EdmGen (or [EdmGen2][2]), it's faster and more controlled. :)

[1]: http://netprovider.cincura.net/
[2]: {{ site.address }}{% post_url 2008-07-08-227892-edmgen-on-steroids-edmgen2 %}