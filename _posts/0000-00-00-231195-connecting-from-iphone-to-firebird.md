---
title: |-
  Connecting from iPhone to Firebird
date: 2010-01-23T21:11:09Z
tags:
  - .NET
  - Apple iPhone/iPad/iPod
  - Firebird
  - Mac
  - Mono
  - MonoTouch
layout: post
---
During the Friday I realized, that I did a long time nothing with my iPhone & [MonoTouch][1] development environment and I should try something more challenging. As I'm still fighting with some good idea for real world test application and my UIs are looking weird, I decided to turn my attention not to iPhone app directly, but to MonoTouch capabilities.

As a true geek I decided to try to connect to Firebird from iPhone. Although, thinking about it, I'm trying to connect to Firebird (or make it work with) with various technologies ([Astoria offline][2], [Silverlight][3], etc.). Because [.NET provider for Firebird][4] is pure C# and we have Mono compatible build, I deduced that it should work with iPhone too.

Sure, it's a nice challenge to whole MonoTouch stack, because the .NET provider is more about the code than about the application itself. And we're using there a lot of different things that can go wrong or may not be available or compilable to native code. And I have to say, the guys behind MonoTouch did a great work (I still can't believe it).

With couple of minor tweaks I was able to create application that connects from iPhone (simulator) through internet to Firebird server. Pure C#, no hacking or major problems.

Application connecting to Firebird server and showing the server version:

[![image](/i/231195/iphone_firebird_thumb.jpg)][5]

First I'm impressed how mature the MonoTouch is. Second I'm still trying think thru all the possibilities you have with this. With some work on UI you can deliver the same database oriented application to Windows Mobile and iPhone using the same business layer (sure some webservice approach would be better, but ...).

[1]: http://monotouch.net/
[2]: {% include post_id_link.txt id="230803" %}
[3]: {% include post_id_link.txt id="230940" %}
[4]: http://firebirdsql.org/index.php?op=files&id=netprovider
[5]: /i/231195/iphone_firebird.png