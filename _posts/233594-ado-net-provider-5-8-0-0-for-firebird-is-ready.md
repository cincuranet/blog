---
title: |-
  ADO.NET provider 5.8.0.0 for Firebird is ready
date: 2017-02-23T10:51:00Z
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
New version 5.8.0.0 of [ADO.NET provider for Firebird][1] is ready for download. The story of this version is _finalizers_. Yeah. 

<!-- excerpt -->

The finalizers in provider were not correct on all places and oftentimes really not needed. The code was usually trying to band-aid programmers' mistakes (bad idea) causing reentrancy problems (the famous `NullReferenceException`s in finalizer thread). No more. These lines are gone and left only on places where it makes sense, highly isolated.

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10804