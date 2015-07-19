---
title: "Multigenerational architecture (in databases) and immutable structures (from functional programming)"
date: 2010-09-10T11:22:29Z
tags:
  - Databases in general
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
redirect_from: /id/231990/
category: none
layout: post
---
I've just realized something interesting.

Right now we're kind of experiencing the renaissance of [functional programming][1] and some (well many) functional concepts are heading into mainstream programming languages.

One of the important concepts in functional programming is, that everything is [immutable][2], hence if you want to change it, you need to create new item with new value(s). Consequently this is very good for parallel programming, as when nothing can change implies there's no shared state.

And one of the segments, where parallel programming is used heavily is database systems. This brings me to my point. You know [MGA/MVCC][3] is used in [Firebird][4], but only in it, also with some modifications in [Oracle Database][5], [MS SQL Server][6], [Postgres][7], ..., in fact many todays modern [RDBMSs][8]. But the concept of MGA is actually idea of using immutable data structures. Yes, it uses some additional concepts to fully support ACID and scale well in some particular cases etc., but the core idea is same.

Isn't it nice? Sometimes you know two things and then suddenly you realize both are based on same idea and are basically same. Connecting dots...

[1]: http://en.wikipedia.org/wiki/Functional_programming
[2]: http://en.wikipedia.org/wiki/Immutable_object
[3]: http://en.wikipedia.org/wiki/Multiversion_concurrency_control
[4]: http://www.firebirdsql.org
[5]: http://www.oracle.com/us/products/database/index.html
[6]: http://www.microsoft.com/sqlserver
[7]: http://www.postgresql.org/
[8]: http://en.wikipedia.org/wiki/Relational_database_management_system