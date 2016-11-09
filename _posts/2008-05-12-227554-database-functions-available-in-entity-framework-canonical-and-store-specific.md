---
title: "Database functions available in Entity Framework [canonical and store specific]"
date: 2008-05-12T16:34:00Z
tags:
  - Entity Framework
  - Firebird
  - LINQ
layout: post
---
You may wonder, how the Entity Framework will map some basic functions (concatenation, average, etc.) from i.e. LINQ or from EntitySQL to functions supported by database and what functions will be "the selected". Well the answer is easy. Every provider will support (should support) so-called canonical functions. For Beta 3 version (current latest) of Entity Framework you can find these on [http://msdn.microsoft.com/en-us/library/bb738626.aspx][1]. As you can see, there's a really good selection of functions and I think most of databases supports them in some way.

I've done some work on canonical functions few says ago in FirebirdClient (ADO.NET provider for Firebird) and 99% of it is build-in FB 2.1. If you're interested in testing, checkout the [weekly builds][2] (except aggregates) all the canonical functions should be working.

From the list I've linked above, you can see, that LINQ is not cripled so for most of task you can used strongly typed way and EntitySQL use for special fine tuned stuff.

Hmmm, you may think, "And what about some database specific functions - my database has a set of really 'must have' function - will be these available?". And the answer is "yes". Every provider can provide DB specific functions, that will be also available in EntitySQL. Nice, isn't it?

[1]: http://msdn.microsoft.com/en-us/library/bb738626.aspx
[2]: http://netprovider.cincura.net/