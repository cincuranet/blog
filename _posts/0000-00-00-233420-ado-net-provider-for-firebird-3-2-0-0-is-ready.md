---
title: |-
  ADO.NET provider for Firebird 3.2.0.0 is ready
date: 2013-10-05T10:06:00Z
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
There's a new version of FirebirdClient waiting for you. Numbered 3.2.0.0. You can get the bits from [NuGet][1] ([EF6-ready version][2]) or from [FirebirdSQL.org site][3] (or [directly][4]).

<!-- excerpt -->

All changes can be found [in tracker][5]. Most notable. Now we have [support for NBackup][6] and "integrated security" works also on 64bit systems (fix contributed by Nathan Fox).

Enjoy.

[1]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient-EF6/
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: http://sourceforge.net/projects/firebird/files/firebird-net-provider/3.2.0/
[5]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?version=10571&styleName=Text&projectId=10003&Create=Create
[6]: {% include post_id_link id="233412" %}