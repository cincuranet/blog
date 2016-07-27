---
title: "Firebird and Entity Framework 4 - stage completed"
date: 2010-06-05T20:12:53Z
tags:
  - .NET
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - Visual Studio
redirect_from: /id/231382/
layout: post
---
The [ADO.NET provider for Firebird][1] now fully supports all the new features in [Entity Framework 4][2]. Simple. If you're eager to test it, grab the [weekly build][3] and enjoy.

We support the internal improvements as well as the visible changes like i.e. [Model First][4] or [CreateDatabaseScript][5] method. The template for creating SQL script is now part of sources and sure will be included in final package as well. I expect to improve it on your feedback and also the model generation from designer is pluggable so you can create custom one and use it there.

To support some new features in SQL generation I had to tweak it little bit and as with every change, there's a change that something goes wrong. Thus I would be more than happy to get some [feedback][6] either that it works OK or any queries where it fails.

I'm so happy to cross this milestone about two months after final [Visual Studio 2010, .NET Framework 4 (incl. Entity Framework 4) were released][7]. You can expect the official release after some testing, it's your turn :).

[1]: http://firebirdsql.org/index.php?op=files&id=netprovider
[2]: http://msdn.microsoft.com/en-us/data/aa937723.aspx
[3]: http://netprovider.cincura.net
[4]: http://blogs.msdn.com/b/adonet/archive/2009/11/05/model-first-with-the-entity-framework-4.aspx
[5]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.createdatabasescript.aspx
[6]: http://firebirdsql.org/index.php?op=lists#fb-dotnet-provider
[7]: http://www.microsoft.com/presspass/press/2010/apr10/04-11vs10pr.mspx