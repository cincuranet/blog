---
title: |
  Be careful with "not" conditions and nulls in LINQ when querying databases
date: 2010-01-21T15:11:31Z
tags:
  - Databases in general
  - Entity Framework
  - LINQ
layout: post
---
Today I seen a code with good chance of hard to find mysterious bugs. Let's start with database table structure we're going to use for demonstration.

```sql
create table NullTest(id int primary key, b bit);
insert into NullTest values (0, 1);
insert into NullTest values (1, 0);
insert into NullTest values (2, null);
```

If you now try to query this table via LINQ (i.e. LINQ to Entities) you may get surprising results.

```csharp
foreach (var item in ent.NullTests.Where(x => x.b != true))
{
	Console.WriteLine(string.Format("ID: {0} t B: {1}", item.id, item.b));
}
Console.WriteLine("===");
foreach (var item in ent.NullTests.AsEnumerable().Where(x => x.b != true))
{
	Console.WriteLine(string.Format("ID: {0} t B: {1}", item.id, item.b));
}
```

If you run this code, you'll get different results.

```text
ID: 1    B: False
===
ID: 1    B: False
ID: 2    B:
```

What happened? Is the database engine doing something wrong? Or is there a bug in LINQ? Neither of those. In fact both results are correct. The second one (evaluated in .NET on client) is obvious why it's as is. But what happened in processing of first one (evaluated on database side)? The devil is in `NULL` logic. Every operation with `NULL` results in `NULL` or false if it's a boolean operation. And this exactly explains the inconsistent result. In .NET `null != true` is true but in databases it's false (because of the `NULL` rules described above).

Thus if you're writing LINQ query for database, although the impedance mismatch should be hidden from you when using LINQ, you need to take into account different `NULL` handling in database engines and in .NET (or any common programming language).

<small>Remember the [DBNull.Value][1]? That was explicit solution for this "problem".</small>

[1]: http://msdn.microsoft.com/en-us/library/system.dbnull.value.aspx