---
title: "ADO.NET provider 4.7.0.0 for Firebird is ready"
date: 2015-07-24T07:49:00Z
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
redirect_from: /id/233515/
category: none
layout: post
---
New 4.7.0.0 version of [ADO.NET provider for Firebird][1] is ready for download. This time I worked on stability improvements. A lot. Huge thanks for all people reporting issues. Some even with test cases and bug analysis - sweet!

<!-- excerpt -->

A good work has been done on improvements of connection pool and sweeping some `NullReferenceException` occurences while in finalizer thread. Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?version=10704&styleName=Text&projectId=10003