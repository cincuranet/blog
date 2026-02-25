---
title: |-
  ADO.NET provider 6.4.0.0 for Firebird is ready
date: 2018-11-02T12:53:00Z
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
New version 6.4.0.0 of [ADO.NET provider for Firebird][1] is ready for download. Among regular bug fixes and improvements I'd like to talk about one performance improvement done in this version.

<!-- excerpt -->

When the providers talks to the server there's a lot of numbers read. And all these numbers are coming as 4 bytes (for 32-bit integers), hence 4 bytes buffer is needed. But it would make sense to reuse it, right? And that's exactly what has been done. The buffer is kept in memory and being reused for `Int32`s and `Int64`s. To measure the impact I did fairly synthetic test of fetching 200k rows with just one number column and the _Gen0_ allocations went down from 41000 to 22500 and allocated memory from ~124MB to ~68MB. I think that's worth having 8 bytes "dangling" in the memory. 8-)

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10884