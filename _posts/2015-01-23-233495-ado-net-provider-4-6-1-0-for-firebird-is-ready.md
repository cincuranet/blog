---
title: "ADO.NET provider 4.6.1.0 for Firebird is ready"
date: 2015-01-23T08:36:00Z
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
redirect_from: /id/233495/
layout: post
---
New 4.6.1.0 version of [ADO.NET provider for Firebird][1] is ready for download. As you can spot from version number change it's not a huge release, but contains some useful changes.

<!-- excerpt -->

What might be interesting for you is new support for restoring (`FbRestore` or `FbStreamingRestore`) database in read-only mode. Also support for Mono has been improved by in a way the error messages are constructed (DNET-570).

Full overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?projectId=10003&styleName=Text&version=10661