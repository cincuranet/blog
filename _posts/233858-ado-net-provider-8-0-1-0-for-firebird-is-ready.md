---
title: |-
  ADO.NET provider 8.0.1.0 for Firebird is ready
date: 2021-04-07T13:48:00Z
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
  - Entity Framework Core
---
New version 8.0.1.0 of [ADO.NET provider for Firebird][1] is ready for download. This a small fix for a - sadly critical - bug that slipped through the [8.0.0 release][6]. I recommend updating immediately.

<!-- excerpt -->

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/11000
[6]: {{ include "post_link" 233856 }}