---
title: |-
  ADO.NET provider 7.1.0.0 for Firebird is ready
date: 2019-09-02T11:26:00Z
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
New version 7.1.0.0 of [ADO.NET provider for Firebird][1] is ready for download. The main focus of this release is performance.

<!-- excerpt -->

There are two main changes around performance - one visible, the other is not. The not visible is, as you'd expect, internals refactoring that saves copying of data hence making all operations faster and requiring less memory (sometimes orders of magnitude less). The other, visible, is replacement of old `TraceSource` type logging, which was very slow (and inconvenient in .NET Core), with custom one using `FbLogManager`, which can be easily plugged into _NLog_, _log4net_, etc. For convenience sake implementation using `Console` is provided out of the box. Eventually I'd like to switch to `Microsoft.Extensions.Logging.Abstractions`, but the wlrd is not there yet.

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

Also huge thanks to companies supporting the development, namely [SMS-Timing][6].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10913
[6]: http://www.sms-timing.com