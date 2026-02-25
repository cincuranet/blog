---
title: |-
  ADO.NET provider 9.0.0.0 for Firebird is ready (with Entity Framework Core 6.0 support)
date: 2022-04-19T08:29:00Z
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
New major version 9.0.0.0 of [ADO.NET provider for Firebird][1] is ready for download. Major version number change, big changes. Buckle up.

<!-- excerpt -->

First big feature is support for Entity Framework Core 6 (including new data types from .NET 6). 

Second big feature is batching API support from Firebird 4. The current implementation focuses on having all the calls in place and I plan to later add some higher level APIs, something like i.e. _FbBulkCopy_, later when enough feedback is collected. The documentation for batching is [here][6].

Finally, smaller, yet still important, improvements are available in this release. For example more detailed [logging][7], [statement timeouts][8] and more.   

The major version is also expected to have some breaking changes and version 9.0 is no exception. Possible breaking changes are marked using _breaking_ tag.  

Overview of all the changes can be found in [here][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (and [EntityFramework.Firebird][3]).

Last, but not least, I'd like to thank [BMI Leisure][9] and [Vertec][10] for continued support of provider. Without such support some big features would be hard to implement.

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: https://github.com/FirebirdSQL/NETProvider/issues?q=is%3Aissue+label%3A%22fix-version%3A+9.0.0.0%22
[6]: https://github.com/FirebirdSQL/NETProvider/blob/master/docs/batching.md
[7]: https://github.com/FirebirdSQL/NETProvider/issues/1007
[8]: https://github.com/FirebirdSQL/NETProvider/issues/877
[9]: https://www.bmileisure.com/
[10]: https://www.vertec.com/
