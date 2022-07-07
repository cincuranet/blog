---
title: |-
  ADO.NET provider 7.10.0.0 for Firebird is ready
date: 2020-12-04T12:09:00Z
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
New version 7.10.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release brings support for new datatypes in Firebird 4 and various improvements across the codebase. 

<!-- excerpt -->

The support for new Firebird 4 datatypes surfaces via three new datatype. `FbDecFloat` handles working with `DECFLOAT(16)` and `DECFLOAT(34)`. `FbZonedDateTime` and `FbZonedTime` for `TIMESTAMP WITH TIME ZONE` and `TIME WITH TIME ZONE` respectively, including support for `EXTENDED` representation. The `INT128` uses regular .NET `BigInteger`. Give these types and try and provide a feedback about what type of API/operations would be helpful (i.e. casting `FbDecFloat` to `float`/`double`), because the API surface at the moment focuses only on the most straightforward API/operations. More information and examples can be found in [docs][6]. 

Other pieces worth mentioning are [DNET-970][7] or [DNET-907][8], better throughput for connection pooling and support for _Read Committed Read Consistency_ isolation level respectively.

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10920
[6]: https://github.com/FirebirdSQL/NETProvider/tree/master/Provider/docs
[7]: http://tracker.firebirdsql.org/browse/DNET-970
[8]: http://tracker.firebirdsql.org/browse/DNET-907
