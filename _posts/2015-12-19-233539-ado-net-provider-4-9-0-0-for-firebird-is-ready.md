---
title: |
  ADO.NET provider 4.9.0.0 for Firebird is ready
date: 2015-12-19T17:13:00Z
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
layout: post
---
New 4.9.0.0 version of [ADO.NET provider for Firebird][1] is ready for download. This release cumulated some pretty diverse set of fixes or features.

<!-- excerpt -->

Probably the biggest feature is the support for [Entity Framework's Migrations][5]. Yes, finally it's there (although one [issue][6] on Entity Framework's side is waiting for release that might affect you). The experience should be as smooth as possible, but don't forget to explore whole surface area (`FbMigrationSqlGenerator`).

Other notable items are the rewrite of parsing for `FbScript` and `FbBatchExecution` ([DNET-266][7]), some finalizer improvements ([DNET-632][8]) and `TimeSpan`/`DateTime` precision improvement ([DNET-654][9]).

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?version=10722&styleName=Text&projectId=10003
[5]: https://msdn.microsoft.com/en-us/data/jj591621.aspx
[6]: http://entityframework.codeplex.com/workitem/2683
[7]: http://tracker.firebirdsql.org/browse/DNET-266
[8]: http://tracker.firebirdsql.org/browse/DNET-632
[9]: http://tracker.firebirdsql.org/browse/DNET-654