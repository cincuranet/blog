---
title: |-
  ADO.NET provider 4.6.2.0 for Firebird is ready
date: 2015-04-15T13:43:00Z
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
New 4.6.2.0 version of [ADO.NET provider for Firebird][1] is ready for download. As you can spot from version number change it's not a huge release, but contains some useful changes.

<!-- excerpt -->

Most of the work has been focused on improving `FbScript` and `FbBatchExecution` classes. This is a first batch of changes, kindly sponsored by [SMS-Timing][5]. I expect some more improvements to come.

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?projectId=10003&styleName=Text&version=10663
[5]: http://www.sms-timing.com/