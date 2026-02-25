---
title: |-
  ADO.NET provider 8.5.0.0 for Firebird is ready
date: 2021-08-17T09:48:00Z
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
New version 8.5.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release contains, among other small improvements and fixes, support for _Srp256_ (and quite a few related changes, like support for _SPB version 3_) and fix for performance regression for synchronous code paths introduced in 8.0.0.0.

<!-- excerpt -->

Overview of all the changes can be found [here][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [FirebirdSql.EntityFrameworkCore.Firebird][4] and [EntityFramework.Firebird][3].

Some features in this release were sponsored by [BMI Leisure][7] and [Vertec][6].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: https://github.com/FirebirdSQL/NETProvider/issues?q=is%3Aissue+label%3A%22fix-version%3A+8.5.0.0%22
[6]: https://www.vertec.com/
[7]: https://www.bmileisure.com/