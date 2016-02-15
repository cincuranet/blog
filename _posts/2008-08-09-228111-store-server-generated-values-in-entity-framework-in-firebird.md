---
title: "Store (server) generated values in Entity Framework in Firebird"
date: 2008-08-09T17:00:00Z
tags:
  - Entity Framework
  - Firebird
redirect_from: /id/228111/
category: none
layout: post
---
You know, server generated values - not only autoincrements are very useful think. Entity Framework supports two types "Computed" and "Identity". When you update or insert entity, these fields are automatically refreshed according to state in database (after calling SaveChanges). For more info look at [StoreGeneratedPattern][1].

In Firebird, there's no identity or autoincrement. Firebird uses generators (sequences) and triggers, but this isn't problem. When you provide some value, it will be rewritten. Anyway, computed fields are supported and you can use it. When you generate model from DB, fields are correctly marked in SSDL and when inserting or updating entity, these fields are refreshed. I've finished "refreshing" implementation today, so feel free to test [weekly builds][2].

[1]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.storegeneratedpattern.aspx
[2]: http://netprovider.cincura.net/
