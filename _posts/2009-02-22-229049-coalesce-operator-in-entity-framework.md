---
title: "Coalesce operator in Entity Framework"
date: 2009-02-22T14:37:00Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - LINQ
redirect_from: /id/229049/
layout: post
---
You may wonder how to use usefull coalesce operator in Entity Framework. If you look to [some EF provider, i.e. for Firebird][1] ;) you will see, that there's no coalesce related code. So you will end up, probably, with code like `x => (x.BAR != null ? x.BAR : "N/A")`. And that's fun until you need longer chain of (not) null checks. But as [Diego Vega][2] pointed in some forum thread, you can use `??` operator. And the `x => x.BAR ?? x.BAR ?? x.BAR ?? "N/A"` looks, in my opinion, better.

But you have to be carefull, because in EF internally it's handled same as first case, so using `CASE`. That means you may hit some query length limits of you database very easily. On the other hand, using it for normal stuff, you probably don't need to care how it's translated inside - important is, that the query is correct.

[1]: http://firebird.svn.sourceforge.net/viewvc/firebird/NETProvider/trunk/NETProvider/source/FirebirdSql/Data/Entity/
[2]: http://blogs.msdn.com/diego/