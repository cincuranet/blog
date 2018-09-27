---
title: |-
  ADO.NET provider for Firebird with Entity Framework 6 support preview
date: 2013-05-31T17:52:07Z
tags:
  - Entity Framework
  - Firebird
  - LINQ
---
The [Entity Framework 6 Beta 1][1], depending on your timezone, was released today. This version brings some breaking changes for applications as well as provider writers.

<!-- excerpt -->

I was not sleeping (OK, I was, but only a little ;)) though the alpha stages, but testing, looking for what's needed to change, learning, bit of coding ;) and so on. That means today, with release of the beta 1, you can also download [FirebirdSql.Data.FirebirdClient][2] that support Entity Framework 6. This version cannot be considered stable, it's not official release ^[<a href=#ref1>1</a>]^. It's just a small something to play with.

I'd like to hear your feedback about what are you using, missing etc. I'm also proud to be basically first open source 3^rd^ party ADO.NET provider to have a working bits for Entity Framework 6. Now we just need to polish the stuff as the Entity Framework gets polished and then enjoy both.

<a name="ref1">[1]</a> Hence please also don't report bugs into tracker.

[1]: http://blogs.msdn.com/b/adonet/archive/2013/05/30/ef6-beta-1-available.aspx
[2]: http://ge.tt/api/1/files/8Itle9i/0/blob?download