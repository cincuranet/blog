---
title: |-
  ADO.NET provider 5.5.0.0 for Firebird is ready
date: 2016-10-05T06:51:00Z
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
I'm going to be honest with you. I'm a bit disappointed. About a month ago I [asked][5] for help with testing the upcoming version of FirebirdClient. The compression support needed quite some work in internals (obviously affecting not only the compression path) and although I tested it left and right the chances for something failing in some corner cases were high. And I could really just use fingers on one hand, and still have a spare, to count people reaching to me and providing feedback. Bit of discrepancy compared to how much emails I get asking for this or that feature being supported. Thanks to those few who did tested it.

<!-- excerpt -->

It's time to release it.

New version 5.5.0.0 of [ADO.NET provider for Firebird][1] is ready for download. There's really just one new notable feature - the compression support for Firebird 3. Along the way the network packets handling was reworked, so you might see some minor performance improvement even if you're not using compression or Firebird 3.

To use compression add `Compression=True` to your connection string and you're good to go. By default it's turned off.

Overview of changes can be found in [tracker][4].

You can get the bits from NuGet [FirebirdSql.Data.FirebirdClient][2] and [EntityFramework.Firebird][3] (or from [firebirdsql.org][1]).

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[3]: http://www.nuget.org/packages/EntityFramework.Firebird/
[4]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10783
[5]: {{ include "post_link" 233572 }}