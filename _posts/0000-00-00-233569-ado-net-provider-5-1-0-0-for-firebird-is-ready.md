---
title: |-
  ADO.NET provider 5.1.0.0 for Firebird is ready
date: 2016-08-29T06:00:00Z
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
New 5.1.0.0 version of [ADO.NET provider for Firebird][1] is ready for download. Notable changes or improvements are [support for new fields in MON$ATTACHMENTS][5] and [support for "-skip_data" in backup/restore][6]. And finally some nice simple [performance tweak around `Charset` class][7].

<!-- excerpt -->

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?styleName=Text&projectId=10003&version=10761
[5]: http://tracker.firebirdsql.org/browse/DNET-652
[6]: http://tracker.firebirdsql.org/browse/DNET-653
[7]: http://tracker.firebirdsql.org/browse/DNET-693