---
title: "UNION and UNION ALL in LINQ to SQL"
date: 2008-05-07T13:20:00Z
tags:
  - .NET
  - Databases in general
  - LINQ
redirect_from: /id/227543/
layout: post
---
When you need to hook up two results in LINQ to SQL you will probably first try the method `Union`. It generates "standard" union (i.e. `select a, b, c from x union select e, f, g from y`), which is OK. But if you know the difference between union and union all (union (without all) is filtering duplicates in result, so it can be slower) you may want to use union all (for example you know that results are distinct or you want duplicates). So, you will need another method. It's called little bit "non-SQL" :) `Concat` (at least it took me few minutes to find it, but the name makes sense). Using this method you get result with union all, so you can save some processing and speedup returning result.

Summary: 
* `UNION ALL` <==> `Concat`
* `UNION` <==> `Union`