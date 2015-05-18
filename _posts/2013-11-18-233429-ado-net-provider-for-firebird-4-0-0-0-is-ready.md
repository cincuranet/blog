---
title: "ADO.NET provider for Firebird 4.0.0.0 is ready"
date: 2013-11-18T10:31:00Z
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
redirect_from: /id/233429
category: none
layout: post
---
Today is your lucky day because the version 4.0.0.0 of FirebirdClient is waiting for you to be downloaded. You can get the bits from [NuGet][1] ([EF6-ready version][2]) or from [FirebirdSQL.org site][3] (or [directly][4]).

<!-- excerpt -->

All changes can be found [in tracker][5]. The major version number has changed and it's indeed a big change. [Bug was found in connection pooling][6] (though visible probably only in some specific conditions because nobody noticed until me now) that resulted in from the ground up rework. That's the only change included. I believe the new connection pooling has cleaner code and offers more performace. Also because of this we decided to drop .NET 3.5 support and offer only 4.0 and higher. You can still use the older version until you're ready to migrate.

The work for this bug fix was fully supported by [SMS-Timing][7]. Big thanks to them.

Enjoy.

[1]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient-EF6/
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: http://sourceforge.net/projects/firebird/files/firebird-net-provider/4.0.0/
[5]: http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?projectId=10003&styleName=Text&version=10580
[6]: http://firebird.1100200.n4.nabble.com/Connection-pool-bug-td4634435.html
[7]: http://www.sms-timing.com/