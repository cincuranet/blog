---
title: |-
  ADO.NET provider 10.0.0.0 for Firebird is ready (with Entity Framework Core 7.0 support)
date: 2023-11-10T09:24:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Entity Framework
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
  - Entity Framework Core
---
New major version 10.0.0.0 of [ADO.NET provider for Firebird][1] is ready for download.

<!-- excerpt -->

Major feature is support for Entity Framework Core 7. I know, we're close to .NET 8 and Entity Framework Core 8 release, but my time was (and still bit is) limited so it took longer than expected. On the other hand, you can [watch][6] the whole process. Should I do the same for Entity Framework Core 8?

Overview of all the changes can be found in [here][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (and [EntityFramework.Firebird][3]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: https://github.com/FirebirdSQL/NETProvider/issues?q=is%3Aissue+label%3A%22fix-version%3A+10.0.0.0%22
[6]: https://youtube.com/playlist?list=PLGaWmUMsKo9mEnu7hIZCR9DaUhp482JvN&si=Pj2CguQJyn15rqNN