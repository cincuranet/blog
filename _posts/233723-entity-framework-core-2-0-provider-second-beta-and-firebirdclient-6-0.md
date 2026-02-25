---
title: |-
  Entity Framework Core 2.0 provider second beta (and FirebirdClient 6.0)
date: 2018-05-24T12:00:00Z
tags:
  - .NET
  - .NET Standard
  - C#
  - Databases in general
  - Entity Framework Core
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
---
It has been a while since I posted new version/beta of FirebirdClient 6.0 and the Entity Framework Core 2.0 (and newer) support. Although I'd like to spend more time on all the providers, my free time is limited (although occasionally somebody sponsors some feature or bux fix), thus the progress is what it is.

<!-- excerpt -->

But this all changes today, as I'm releasing the second beta. Improvements and bug fixes happened in Entity Framework Core support as well as FirebirdClient itself. And although the work is never done, unless some serious issue is found, this version will be followed by a final version soon.

To start, download the [`FirebirdSql.EntityFrameworkCore.Firebird`][1] and [`FirebirdSql.Data.FirebirdClient`][2] `beta2` NuGet packages. Small sample can be found in [previous post][4].

Make sure to understand [breaking changes in v6 of FirebirdClient][3].

Migrations and scaffolding are still not included in this version.

[1]: https://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/6.0.0-beta2
[2]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/6.0.0-beta2
[3]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10850
[4]: {{ include "post_link" 233653 }}