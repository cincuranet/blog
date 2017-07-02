---
title: |-
  ADO.NET provider for Firebird 3.1.0.0 is ready
date: 2013-07-30T06:40:58Z
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
With [yesterday's sources move][1] I have another good news. The version 3.1.0.0 of ADO.NET provider for Firebird is ready for your download!

<!-- excerpt -->

This version fixes few issues from previous version and adds some new features. For example sweep and error logging support to TraceAPI, support in installer for x64 systems, bunch of fixes in current Entity Framework support as well as initial support for Entity Framework 6 (download package with "EF6" in name).

Entity Framework 6 is not currently released as RTM (thus there might be changes). Everything from infrastructure point of view should work, currently only full async stack is missing (for whole ADO.NET) and "Migrations" SQL generator.

Description of all changes is available in [tracker][2].

You can get the bits from [NuGet][3] (recommended) or from [FirebirdSQL.org site][4] (or [directly][5]).

Enjoy.

[1]: {% include post_link, id: "233371" %}
[2]: http://tracker.firebirdsql.org/secure/IssueNavigator.jspa?reset=true&pid=10003&fixfor=10491
[3]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[4]: http://www.firebirdsql.org/en/net-provider/
[5]: http://sourceforge.net/projects/firebird/files/firebird-net-provider/3.1.0/