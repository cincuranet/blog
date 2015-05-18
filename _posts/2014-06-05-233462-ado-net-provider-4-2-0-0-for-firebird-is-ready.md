---
title: "ADO.NET provider 4.2.0.0 for Firebird is ready"
date: 2014-06-05T06:20:00Z
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
redirect_from: /id/233462/
category: none
layout: post
---
Firebird (2.5.2+) has finally [support][6] for creating backups and streaming these back to client via API (Services API). This release focuses mostly on implementing this feature. 

<!-- excerpt -->

In `FirebirdSql.Data.Services` you can find two new classes called `FbStreamingBackup` and `FbStreamingRestore`. These work mostly as `FbBackup` and `FbRestore` you only need to set valid stream (like [`FileStream`][7] or [`MemoryStream`][8]) into `OutputStream` or `InnerStream` respectively. The rest is same as if you're using `fbsvcmgr`.

This feature was sponsored by [SMS-Timing][9] as they allowed me to implement it during my work hours. Also thanks to Ivan Arabadzhiev who helped me to test this.  

You can get the bits from [NuGet][1] ([EF6-ready version][2]) (also [FirebirdSQL.org site][3]).

All changes can be found [in tracker][5].

[1]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient-EF6/
[3]: http://www.firebirdsql.org/en/net-provider/
[5]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?projectId=10003&styleName=Text&version=10587
[6]: http://tracker.firebirdsql.org/browse/CORE-2666
[7]: http://msdn.microsoft.com/en-us/library/vstudio/system.io.filestream
[8]: http://msdn.microsoft.com/en-us/library/system.io.memorystream.aspx
[9]: http://www.sms-timing.com/