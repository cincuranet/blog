---
title: |-
  ADO.NET provider 7.5.0.0 for Firebird is ready (with Entity Framework Core 3.1 support)
date: 2020-02-06T06:07:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
---
New version 7.5.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release brings support for Entity Framework Core 3.1 (3.1.1 to be precise), Entity Framework 6.4 and some small bug fixes.

<!-- excerpt -->

One notable item to consider when updating to new version is [this fix][6] to match the specification.

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10915
[6]: http://tracker.firebirdsql.org/browse/DNET-927