---
title: |-
  External procedures in Firebird in .NET done(-ish)
date: 2016-07-17T07:44:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
layout: post
---
Over the rainy afternoons I slowly went through all the notes in the code I made when cutting corners to make it work as fast as possible and started cleaning. Just cleaning, no serious performance measurements nor improvements were done. But now it's without any nasty hacks and shortcuts.

<!-- excerpt -->

> Read also the [previous post][3].

The concepts are still the same as before. It should just work better and could be used in production. You can download the [32-bit build][1] or [64-bit build][2] depending on what Firebird bitness you're running.

I'd like to get some feedback how it's used and what you'd like to have implemented. Before I get enough ideas and so on I'll suspend my work on this and focus also a little on FirebirdClient. Let's see where this ends.

_BTW if you look very closely you might find kind of easter egg. ;)_   

[1]: /i/233566/FbNetExternalEngine32.7z
[2]: /i/233566/FbNetExternalEngine64.7z
[3]: {% include post_id_link.txt id="233565" %}