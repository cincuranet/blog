---
title: |-
  ADO.NET provider 5.9.0.0 for Firebird is ready
date: 2017-05-07T05:15:00Z
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
New version 5.9.0.0 of [ADO.NET provider for Firebird][1] is ready for download. Except for few bug fixes, the main focus was na re-implementing events.  

<!-- excerpt -->

Because there's quite a few changes in `FbRemoteEvent` I wrote a [separate article][5] explaining all the changes.

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?styleName=Text&projectId=10003&version=10812
[5]: {% include post_link id="233621" %}