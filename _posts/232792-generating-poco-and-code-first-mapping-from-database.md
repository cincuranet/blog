---
title: |-
  Generating POCO and Code First mapping from database
date: 2012-04-16T12:23:58Z
tags:
  - Entity Framework
  - Firebird
---
I like POCOs and Code First. Simply because that way I have everything under my control. I don't mean just the code itself, but also the formatting, ordering of static/public/private/... properties etc. Same with mapping. Everything is described by me. No magic conventions. But there was one problem. If you already had a database (even with new database the initial amount of tables is big) writing all this stuff was tedious and boring.

Apart from the option to write the tool to do it yourself, there was an "hack" to create a EDMX model and generate classes (easy) and mapping (little harder) from it. In fact there are some templates ready, so you don't have to start from scratch. But still, too much "problems".

Luckily now there's a tool for that, that does all in one step. [EF Power Tools (currently Beta 2)][1]. When you right-click on project, you'll get _Entity Framework_ menu with _Reverse Engineer Code First_.

![image]({{ include "post_ilink" page "ef_power_tools_b2.png" }})

This will query the database similar as when using EDMX and spit out entity classes and (complete) mapping (using Fluent API). You can even customize the template being used for generating code. It's just T4. Only difference is, that you can't select subset of tables. It will always create code from whole database (which can be problem for huge legacy databases). And you don't have any progress while process is running. But it's still beta. :) On the other hand, you can run it multiple times, it will overwrite the original files, so you'll get fresh mapping, which can be quite handy, and entities (sure you're using VCS to merge your changes back).

I tried it even with Firebird and worked as expected, probably any EF enabled provider will work.

If you'd like to read more about features, check the [blog post on ADO.NET team blog][2]. Other are interesting too (like _View Entity Data Model (Read-only)_).

[1]: http://visualstudiogallery.msdn.microsoft.com/72a60b14-1581-4b9b-89f2-846072eff19d
[2]: http://blogs.msdn.com/b/adonet/archive/2012/04/09/ef-power-tools-beta-2-available.aspx