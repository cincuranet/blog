---
title: |-
  Entity Framework v4 and Firebird - moving forward
date: 2010-05-04T20:35:43Z
tags:
  - .NET
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - Visual Studio
layout: post
---
As it may look like nothing is going on, it's not true. Next to Firebird 2.5 new protocol features, I'm also working on Entity Framework v4 support. Before I go further, be sure, that all providers written for Entity Framework v1 are also working with v4.

In fact right now all the major improvements in Entity Framework v4 are supported. You can benefit from features available, like the `LIKE` translation support or plenty of new functions. My personal favorite is [TruncateTime][1] (so I can get rid of [workaround][2]). The [Model First][3] approach is next in a row. At least basic T4 template for start is my aim. The rest could be done by you, simply modifying the template. And also wiring the template into code so you can use it programmatically too. Under the cover, while working on new stuff I'm also finding ways to optimize the code. Luckily the changes will be noticeable. ;)

The DDEX for Firebird supports Visual Studio 2010 and the full Entity Framework v4 support will be here soon – now you can try a [weekly build][4].  Feel free to ask about anything related.

[1]: http://msdn.microsoft.com/en-us/library/dd395596(VS.100).aspx
[2]: {% post_url 0000-00-00-231060-comparing-date-only-in-ef %}/
[3]: http://msdn.microsoft.com/en-us/data/ff628199.aspx
[4]: http://netprovider.cincura.net