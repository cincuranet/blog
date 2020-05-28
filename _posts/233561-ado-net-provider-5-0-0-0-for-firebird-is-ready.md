---
title: |-
  ADO.NET provider 5.0.0.0 for Firebird is ready
date: 2016-05-17T09:02:00Z
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
New 5.0.0.0 version of [ADO.NET provider for Firebird][1] is ready for download. As you can see the major version number changed.

This release contains two new big features, both focused on Firebird 3. The `BOOLEAN` datatype is now supported (except Entity Framework mapping, currently). And SRP authentication is supported on Firebird 3. I think these are the most fundamental new features so I'm releasing it now. There's more to come.

Also internals of the protocol handling were refactored and slightly cleaned up (and more to do). Hopefully that will enable easier improvements and fixes in the future.

<!-- excerpt -->

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10744