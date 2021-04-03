---
title: |-
  FirebirdClient version 6.0, Entity Framework Core 2.x provider, Entity Framework 6 provider
date: 2018-06-07T13:04:00Z
tags:
  - .NET
  - .NET Core
  - C#
  - Databases in general
  - Entity Framework
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
  - Entity Framework Core
---
Yep, it's finally here. The big version, version 6.0, of FirebirdClient and providers for Entity Framework Core and Entity Framework 6. I think this is the biggest release ever. A lot of changes (some breaking). Let's take it one by one.

<!-- excerpt -->

#### FirebirdClient 6.0

Although only about 20 items were completed in this version, some have quite a big impact. Some sweeping also happened. For example item from 2013 - yes, that's five years - was finally resolved (it took so long because it's a huge breaking change). You can get overview of all changes from [tracker][5].

Because some changes are (can be) breaking, all these items are [marked `#breaking` in tracker][6] for your convenience. You _should_ check your code before updating. To mention few important:

* Support for .NET 4.0 was dropped (DNET-774).
* Only Entity Framework 6 is supported and Entity Framework provider is completely moved to separate assembly, using new namespaces (DNET-732).
* GUIDs in/from .NET have the same representation as in Firebird (DNET-509).

#### Entity Framework Core 2.x provider

You can now use Entity Framework Core 2.x with Firebird. The NuGet package is `FirebirdSql.EntityFrameworkCore.Firebird`. Small tutorial to get you started is [here][7].

Scaffolding and Migrations are not part of this version (mostly to not block the release).

#### Entity Framework 6 provider

Only Entity Framework 6 is now supported and new namespaces are used (`EntityFramework.Firebird`). Small tutorial to get you started is [here][8].

#### Documentation

To help you started with usage, I created documents for [ADO.NET][9], [Entity Framework Core][7] and [Entity Framework 6][8]. At the moment I went with the simplest solution, plain Markdown files [in docs folder][10] in the repository, and let's see where that ends. Feel free to contribute.

#### Getting the bits

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [FirebirdSql.EntityFrameworkCore.Firebird][4], [EntityFramework.Firebird][3].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10850
[6]: http://tracker.firebirdsql.org/sr/jira.issueviews:searchrequest-printable/temp/SearchRequest.html?query=%23breaking&summary=true&pid=10003&fixfor=10850&tempMax=1000
[7]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/blob/master/Provider/docs/entity-framework-core.md
[8]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/blob/master/Provider/docs/entity-framework-6.md
[9]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/blob/master/Provider/docs/ado-net.md
[10]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/tree/master/Provider/docs