---
title: |-
  ADO.NET provider for Firebird version 2.6.5 released
date: 2011-06-03T12:30:01Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
---
I'm proud to announce new version of ADO.NET provider for Firebird - 2.6.5. It's half maintenance release, half new features.

You can find all bug fixes in [tracker][1].

The new features include and improvements:

* [Support for Trace API in Firebird 2.5][2].
* Improvements in SQL generation for Entity Framework.
* [Support for commands logging ][3].
* Slightly faster command execution of big queries.
* And a lot of small code improvement making it more stable...


You can download it at [http://sourceforge.net/projects/firebird/files/firebird-net-provider/2.6.5/][4] or [http://www.firebirdsql.org/en/net-provider/][5].

Hope you'll enjoy the release.

[1]: http://tracker.firebirdsql.org/secure/IssueNavigator.jspa?reset=true&&pid=10003&fixfor=10400&sorter/field=issuekey&sorter/order=DESC
[2]: {{ include "post_link" 232218 }}
[3]: {{ include "post_link" 232387 }}
[4]: http://sourceforge.net/projects/firebird/files/firebird-net-provider/2.6.5/
[5]: http://www.firebirdsql.org/en/net-provider/