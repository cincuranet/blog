---
title: |-
  Unique constraint on MS SQL?!
date: 2009-09-26T15:06:49Z
tags:
  - Databases in general
  - Firebird
  - MS SQL Server
  - Oracle
---
I have a strong feeling that MS SQL knows I don't like it. I don't say it's a bad database, but sometimes it's really "interesting". ;)

OK, so what I faced this time? Let's start with basic facts. The NULL value in database is a special value. NULL and NULL is again NULL, NULL and False is again NULL and NULL isn't equal to NULL. Two days ago I was creating a chain of records in database (which isn't too relationalish, but …) and I needed unique constraint on one column. No problem you may think. So did I. But not in MS SQL.

Check this example:

```text
1> create table test(id int primary key, foo int);
2> create unique index idx_text on test(foo);
3> go
1> insert into test values (1, null);
2> go
(1 rows affected)
1> insert into test values (2, null);
2> go
Msg 2601, Level 14, State 1, Server X2-001SQLEXPRESS, Line 1 Cannot insert duplicate key row in object 'dbo.test' with unique index 'idx_text '.
The statement has been terminated.
```
What a mess! Looks like somebody in MS SQL engine team thinks NULL == NULL. After some railing, testing on Firebird and asking my friend about Oracle, I googled: [https://connect.microsoft.com/SQLServer/feedback/ViewFeedback.aspx?FeedbackID=299229][1]. Looks like I'm not alone; feeling better. ;)

Luckily I'm working on MS SQL 2008 and I can use filtered indices. Created unique index with where clause `where <column> is not null` and I'm done. But boy that was a bitter finding. Hope I'll not be punched to the face with these basics again in an at least two months.

[1]: https://connect.microsoft.com/SQLServer/feedback/ViewFeedback.aspx?FeedbackID=299229