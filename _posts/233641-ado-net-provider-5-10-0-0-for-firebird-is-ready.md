---
title: |-
  ADO.NET provider 5.10.0.0 for Firebird is ready
date: 2017-08-25T05:49:00Z
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
New version 5.10.0.0 of [ADO.NET provider for Firebird][1] is ready for download. Apart from regular bugfixes some new features are available. Notably, `FbTrace` now supports new format of Firebird 3 and then `DefaultFbMigrationSqlGeneratorBehavior` allows easier customization in case you want specific behavior for Entity Framework Migrations.   

<!-- excerpt -->

Overview of all the changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10833