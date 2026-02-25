---
title: |-
  ADO.NET provider 8.0.0.0 for Firebird is ready (with Entity Framework Core 5.0 support)
date: 2021-04-01T06:57:00Z
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
New version 8.0.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release is a big one. Huge.

<!-- excerpt -->

First some stats to back my claim of this release being huge. There has been 15622 additions and 11915 deletions over a projects with about 50 kLOC in total. Big thanks to [B&MI][7] for supporting me and hence transitively this release.

Two major themes make 8.0 version. The first one is complete non-blocking/async code paths and the other is Entity Framework Core 5.0 support. 

I recommend using the `XxxAsync` methods whenever you care about performance, especially when running on .NET 5.0 or .NET Core 3.1. Also, where reasonable, the `IAsyncDisposable` is implemented. Together with that, proper `CancellationToken` handling is supported. When the `CancellationToken` is used in `FbCommand` and `FbDataReader` the cancellation is "explicit" ([related reading][6]), meaning the command running is cancelled on the server and the protocol state is consistent after cancellation and you can continue using the instances. Other classes, like `FbConnection`, leave the protocol or network in unknown state, thus continuing using these is likely not going to work.

Entity Framework Core 5.0 support should be pretty self-explanatory.

The major version is also expected to have some breaking changes and version 8.0 is no exception. Possible breaking changes are marked _#breaking_ in the tracker.  

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10970
[6]: https://www.roji.org/db-commands-and-cancellation
[7]: https://b-mi.net/