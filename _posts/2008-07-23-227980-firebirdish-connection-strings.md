---
title: |-
  "Firebirdish" connection strings
date: 2008-07-23T08:52:00Z
tags:
  - .NET
  - Firebird
layout: post
---
Did you know, that you can use in [Firebird .NET Data Provider][1] more "firebirdish" connection strings?

You can put into FbConnection `"database=<hostname/port:path>;user=<user>;password=<password>` or the `hostname/port:path` can be `//hostname:port/path`.

[1]: http://www.firebirdsql.org/index.php?op=files&id=netprovider