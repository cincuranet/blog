---
title: "ADO.NET provider 5.6.0.0 for Firebird is ready (with .NET Core support)"
date: 2016-11-02T10:20:00Z
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
redirect_from: /id/233580/
layout: post
---
New version 5.6.0.0 of [ADO.NET provider for Firebird][1] is ready for download. There's really only one new feature in this release - .NET Core support!

<!-- excerpt -->

The port was sponsored by [Integrative][5], so pay them a visit on the website.

Right now the target is `netstandard1.6`. So you can use it on .NET Core 1.0 (`netcoreapp1.0`) and .NET Framework 4.6.3 (when it's available). Every feature, including the `Embedded` mode (whoa), is supported except for `Schema` namespace. I'm waiting for `netstandard2.0` (probably) when the .NET Core will have clear(er) vision around that.

Next big stop? Entity Framework Core 1.0/1.1.

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?styleName=Text&projectId=10003&version=10784
[5]: http://www.integrative.co.za/