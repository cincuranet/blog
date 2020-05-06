---
title: |-
  ADO.NET provider 4.5.0.0 for Firebird is ready
date: 2014-07-28T08:05:00Z
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
I'm pleased to announce new version - version 4.5.0.0 - of [ADO.NET provider for Firebird][3]. This version provides improved support for Entity Framework 6 and also countless hours and builds has been spent on hunting some race conditions in "events" support. 

<!-- excerpt -->

The "events" are having still the same public interface but the internals are greatly reviewed. Three people (me, Alexander Muylaert-Gelein, Danny Van den Wouwer if you'd like to buy as a [beer|tee|ice-cream|chocolate] during upcoming [conference][5]) spent something between three and four days turning knobs over the places. But if you look at the code, changes are really small. The beauty of bug fixing.

The Entity Framework 6 support has now been split into separate `EntityFramework.Firebird` assembly and into new namespaces (`FirebirdSql.Data.EntityFramework6`), mostly to help with cases where you're not using Code First, but EDMX. It's because DDEX needs to load the provider as well and hence you likely have the `FirebirdSql.Data.FirebirdClient` in GAC the type collisions were _almost_ inevitable. But take a note that `FirebirdSql.Data.FirebirdClient` versions used in project (i.e. from NuGet) and in GAC _must match_ (sadly this is limitation because of how current Entity Framework tooling works). The [example][6] is updated as well.

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][1] and [EntityFramework.Firebird][2] (or from [firebirdsql.org][3]).

High level overview of changes can be found in [tracker][4].

[1]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[2]: http://www.nuget.org/packages/EntityFramework.Firebird/
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?projectId=10003&styleName=Text&version=10600
[5]: http://www.firebirdsql.org/en/firebird-conference-2014/
[6]: {{ include "post_link" 233472 }}