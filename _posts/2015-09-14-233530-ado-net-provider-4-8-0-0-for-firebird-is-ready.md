---
title: "ADO.NET provider 4.8.0.0 for Firebird is ready"
date: 2015-09-14T08:19:00Z
tags:
  - .NET
  - Announcements &amp; Invitations
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
redirect_from: /id/233530/
category: none
layout: post
---
New 4.8.0.0 version of [ADO.NET provider for Firebird][1] is ready for download. This release constains mostly performance improvements, although some bugs were fixed as well.

<!-- excerpt -->

Overview of changes can be found in [tracker][4]. Please take a extra attention to DNET-625 and DNET-626 as these might silently affect your code in an unexpected way.

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?version=10705&styleName=Text&projectId=10003
[5]: http://tracker.firebirdsql.org/browse/DNET-625
[6]: http://tracker.firebirdsql.org/browse/DNET-626