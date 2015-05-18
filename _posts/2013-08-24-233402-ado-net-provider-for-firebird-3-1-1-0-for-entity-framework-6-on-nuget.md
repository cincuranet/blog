---
title: "ADO.NET provider for Firebird 3.1.1.0 for Entity Framework 6 on NuGet"
date: 2013-08-24T09:16:21Z
tags:
  - .NET
  - Announcements &amp; Invitations
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - NuGet
  - SQL
  - Visual Studio
redirect_from: /id/233402
category: none
layout: post
---
Few days ago the [Entity Framework 6][1] jumped into RC stage. [FirebirdClient ][2]has already support for Entity Framework 6, but I was waiting for some "significant" (as RC ;)) stage to start pushing it more except for publishing the build on [FirebirdSQL.org site][3].

<!-- excerpt -->

Thus without further talking let me introduce [FirebirdSql.Data.FirebirdClient-EF6][4]. It's the same version as [FirebirdSql.Data.FirebirdClient][5] except build for Entity Framework 6 (though no dependency on [EntityFramework][6] package is there - you'll be able to use it without it).

Enjoy. And report any issues you find.

[1]: http://entityframework.codeplex.com/wikipage?title=specs
[2]: http://www.firebirdsql.org/en/net-provider/
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient-EF6
[5]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient
[6]: http://www.nuget.org/packages/EntityFramework