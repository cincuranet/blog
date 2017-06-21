---
title: |-
  Compression support in FirebirdClient beta
date: 2016-09-14T06:48:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
As promised yesterday I have a beta of FirebirdClient with compression support (Firebird 3). It's available on [NuGet][1].

<!-- excerpt -->

It needed few iterations of different implementations and also uncovered some bugs on other places. I've run maybe hundreds of tests, because the network stream handling was changed and improved, but you never know. That means testing on previous versions of Firebird is welcome as well.

To turn on compression you need to enable it on server with `WireCompression = true`. Then in connection string set `Compression` value to `True` as well, whenever you want to use it.

If you find some unexpected behavior, open a discussion in firebird-net-provider mailing list. If everything is fine, you can leave a comment here or something like that, so I know how much it was tested already. 

Note: Also there's a [known issue][2] in Firebird, which you might hit. Just use snapshot build of Firebird 3.0.1.

[1]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/5.5.0-beta1
[2]: http://tracker.firebirdsql.org/browse/CORE-5347