---
title: |
  Firebird(Client) with Silverlight
date: 2009-10-18T16:53:49Z
tags:
  - Firebird
  - OData/Data Services (Astoria)
  - Silverlight
layout: post
---
I had this idea on my list for a couple of months and I was always postponing it, because it's stupid. But you know. Exploring the unexplored ways, that's what I like to do :).

But during (or after, I don't remember) [my presentation about Entity Framework][1] there was a question about accessing the data provided by EF from Silverlight. Sure, doing it directly isn't a good idea and in fact this is the reason why Astoria, eh, ADO.NET Data Services is here. But is this really stupid? Can it work?

Nope. Not at all. I tried to build FirebirdClient in a Silverlight environment and I failed. I expected to fail after some attempts with modifications and using only subset of features like i.e for Compact Framework, but this was really fast. Silverlight is only subset of .NET Framework. And one crucial part is not there, it's System.Data stuff and without it you can drop major part of any ADO.NET provider's code.

If you need data, use ADO.NET Data Services or any other webservices (which will also fit for DDL etc. commands). That also means, that writing Silverlight based Firebird database manager (without any support backend), which is one of few reasonable ideas, cannot be done either.

[1]: {% post_url 2009-10-03-230843-prednaska-ado-net-entity-framework-microsoft-praha %}