---
title: |-
  ADO.NET provider 6.6.0.0 for Firebird is ready
date: 2019-04-01T12:28:00Z
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
New version 6.6.0.0 of [ADO.NET provider for Firebird][1] is ready for download. This release fills all the holes in the Entity Framework Core support. To be precise now _Migrations_ are fully supported and query pipeline has been massively improved. Just to give you an idea, about 4100 tests were added. If you want to use Entity Framework Core with Firebird, now is the time.

<!-- excerpt -->

Overview of all the changes can be found in [tracker][5].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2], [EntityFramework.Firebird][3] and [FirebirdSql.EntityFrameworkCore.Firebird][4] (or from [firebirdsql.org][1]).

Also huge thanks to companies supporting the development, namely [SMS-Timing][6].

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/
[5]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10890
[6]: http://www.sms-timing.com