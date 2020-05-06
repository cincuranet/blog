---
title: |-
  Entity Framework Core 2.0 provider for Firebird now in beta
date: 2017-12-11T20:00:00Z
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
As I'm sweeping the corners, the work is less glamorous (read: close to zero outside contributions) and every move is harder and harder. But despite all of that, I'm glad to move one step closer to the RTM version of Entity Framework Core 2.0 provider for Firebird and jump to the _beta phase_.

<!-- excerpt -->

I'm feeling confident the provider is almost ready for the prime time. Of course, I can test it left and right, but that's nothing compared to what you can, and I'm sure you will, do with it. In other words, every feature should work and you can play with it as much as you can. If not, leave a comment here with a link to a code where the issue surfaces.

To start, download the [`FirebirdSql.EntityFrameworkCore.Firebird`][1] and [`FirebirdSql.Data.FirebirdClient`][2] `beta1` NuGet packages. Small sample can be found in [previous post][4].

Migrations and scaffolding are still not included in this version (and very likely will land in next version).

Also make sure to understand [breaking changes in v6 of FirebirdClient][3], which has been released as well.

[1]: https://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/6.0.0-beta1
[2]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/6.0.0-beta1
[3]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10850
[4]: {{ include "post_link" 233653 }}