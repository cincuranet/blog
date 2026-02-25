---
title: |-
  ADO.NET provider 7.0.0.0 for Firebird is ready
date: 2019-08-15T09:45:00Z
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
New version 7.0.0.0 of [ADO.NET provider for Firebird][1] is ready for download. The main focus of this release is wire encryption.

<!-- excerpt -->

#### Wire encryption

Firebird 3 came with wire encryption support, but until now it was not supported in FirebirdClient. Luckily company called [Vertec][6] contacted me and helped prioritize this work by sponsoring it. Big thanks to them. In this new version you can use new parameter in connection string called `wire crypt` (and similarly in `FbConnectionStringBuilder`) with values `Enabled`/`Disabled`/`Required` with the same meaning as on the server in `firebird.conf`. The default value is `Enabled`.

#### Other changes

Overview of all the changes can be found in [tracker][5], but I'd like bring special attention to items marked with _#breaking_ in the title, because as you can guess, these might be breaking changes in some cases. Other worth mentioning are support for IPv6 in connection strings and URL-style connection string and support for "explain plan".

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10912
[6]: https://www.vertec.com/