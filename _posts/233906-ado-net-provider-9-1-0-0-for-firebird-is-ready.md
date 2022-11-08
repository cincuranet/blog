---
title: |-
  ADO.NET provider 9.1.0.0 for Firebird is ready
date: 2022-11-08T08:34:00Z
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
New version 9.1.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release adds new features here and there and also some bug fixes. Notable features are support for parallel workers (planned for Firebird 5) and support for "at number" for snapshot transactions.

<!-- excerpt -->

Overview of all the changes can be found [here][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [FirebirdSql.EntityFrameworkCore.Firebird][4] and [EntityFramework.Firebird][3].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: https://github.com/FirebirdSQL/NETProvider/issues?q=is%3Aissue+label%3A%22fix-version%3A+9.1.0.0%22
