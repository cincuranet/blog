---
title: |-
  Entity Framework v4.1 Code First and Firebird
date: 2011-03-16T20:16:29Z
tags:
  - Entity Framework
  - Firebird
---
I do love Entity Framework. And you probably know it from the amount of weird ways to do some things published on this blog. And so I do love Code First. It's like having all the power absolutely under control (or at least there's a possibility to have it). And I also do love Firebird. It's a great database engine. And I admit, it has strong as well weak points. But every engine does.

So there's no wonder I'm using Entity Framework's 4.1 (currently in CTP stage) Code First with Firebird. If you're a bit lazy and you're specifying only required minimum on information to run the mapping, you might quickly face one problem.

Long story. If you generated your model from database, the SSDL contained a lot of information about database structure. Especially lengths of (var)char fields. And these information were then used by [provider for Firebird][1] to create proper queries. But with Code First it's bit boring to specify lengths for string fields moreover, when it works without it.

But the Firebird's API has some limitations (especially around sizes of stuff) and by default (right now - CTP) the (var)char fields are 4000 characters long. The amount of (var)char parameters in code is limited (depends on few variables like charset, hence I'm not putting here exact number) and with UTF8 (multi-byte charset) it's even more limited. And UTF8 is option #1 in .NET world.

All this together, couple of (var)char fields without length specified and you could start seeing `Implementation limit exceeded` and `block size exceeds implementation restriction` etc. The first place where you'll see it is inserting, because there you have all the fields.

The solution is easy. Specify lengths explicitly and hope for the best. If the table is very wide (aka it doesn't work), you could always split the table in more (yes, not great, but ...).

[1]: http://www.firebirdsql.org/index.php?op=files&id=netprovider