---
title: |-
  Astoria "offline" and Firebird
date: 2009-09-07T06:24:48Z
tags:
  - Astoria "offline"
  - Entity Framework
  - Firebird
  - OData/Data Services (Astoria)
---
Few weeks ago I was playing (and I'm still about to continue playing) and [writing about Astoria offline][1]. I setted up some challenge for me to try to make it work with Firebird (as the big database, SQL CE still as local store). It looked like it should be plausible. But it's not. :)

After creating model from database, creating and rewriting sql scripts for Firebird, I tried to use this model in Astoria offline. Here I hit the wall. After couple of hours I gave up and talked with [Pablo Castro][2], who did much of the work in Astoria offline. He confirmed that there's no particular check and reject other databases, but with this "offline preview" there's a lot of assumption for MS SQL Server.

Never mind, when another test version will be available be sure, I'll try it and we'll see what's what. :)

[1]: {% include post_link, id: "230768" %}
[2]: http://blogs.msdn.com/pablo