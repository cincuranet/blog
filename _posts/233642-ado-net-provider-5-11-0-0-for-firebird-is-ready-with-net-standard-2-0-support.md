---
title: |-
  ADO.NET provider 5.11.0.0 for Firebird is ready (with .NET Standard 2.0 support)
date: 2017-08-30T05:41:00Z
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
New version 5.11.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release is about .NET Standard 2.0. Now the .NET Standard 2.0, with all the new APIs supported, version is available (this work, together with upcoming Entity Framework Core 2.0 support, is sponsored by [Integrative9][7]).

Another new [feature][5] is support for passing key over the wire for encrypted databases (you need to have server side plugin for this feature, i.e. [this from IBPhoenix][6]). New connection string property `crypt key` is available for that. The value is base64 encoded data representing the key. You can find [small example in tests][8].

<!-- excerpt -->

Overview of all the changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10853
[5]: http://tracker.firebirdsql.org/browse/DNET-779
[6]: http://www.ibphoenix.com/products/software/encryptionplugin
[7]: https://www.integrative9.com/
[8]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/blob/5.11.0.0/Provider/src/FirebirdSql.Data.UnitTests/FbConnectionStringTests.cs#L157-L179