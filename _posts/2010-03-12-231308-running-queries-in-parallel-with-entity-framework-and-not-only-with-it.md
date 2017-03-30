---
title: |-
  Running queries in parallel with Entity Framework (and not only with it)
date: 2010-03-12T18:56:27Z
tags:
  - Databases in general
  - Entity Framework
  - Firebird
  - LINQ
  - MS SQL Server
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Oracle Database
layout: post
---
From time to time I have to run two or more queries that I know will always be two or more - like some first/skip records and also total count. If you write it as two queries and execute, that means two round trips to database. Although it may not matter if the network latency is very small, why not to challenge myself and try to find some workarounds.

Sure you can create some stored procedures and get the data back from these, but I was thinking about more LINQ to Entitiesish way. I recalled a way I one time used inside one project. Although it was done in pure SQL, it, as it turned out, works, kind of, for LINQ to Entities as well.

The idea is using "one row table" and put the queries as columns. Let me demonstrate:

```sql
select
  (select foo, bar from table1 where ...),
  (select baz, foo from table2 where ...)
from OneRowTable;
```

Where the `OneRowTable` can be specially created table or i.e. for Firebird `RDB$DATABASE` or for Oracle Database `dual`. It isn't the nicest SQL (and also challenges optimizer), but works. In columns as queries you can put anything you want as long as it is syntactically correct.

OK, what about the Entity Framework or LINQ to Entities respectively. I created the "one row table" first:

```sql
create table OneRowTable(x bit primary key);
insert into OneRowTable values (0);
```

The table needs to have the primary key to be able to import it into entity model, the datatype doesn't matter (I was using MS SQL, hence the `bit`).

What about the queries? Similar approach:

```csharp
var allinone = context.OneRowTable.Select(_ => new
{
	AData = context.a.Where(a => a.x.HasValue && a.x.Value > 10).Select(a => new { A1 = a.id, A2 = a.id * 2 }),
	BData = context.b.Where(b => b.id < 999).Select(b => new { B1 = b.id, B2 = b.y }),
});
string query = (allinone as ObjectQuery).ToTraceString();
var data = allinone.First();
var adata = data.AData;
var bdata = data.BData;
```

The `a` and `b` are my testing tables. You can check there's only one query executed. Encapsulating this into some method is only piece of cake.

And how the query looks like? Well for my MS SQL test:

```sql
SELECT
[UnionAll1].[x] AS [C1],
[UnionAll1].[C2] AS [C2],
[UnionAll1].[C1] AS [C3],
[UnionAll1].[id] AS [C4],
[UnionAll1].[id1] AS [C5],
[UnionAll1].[C3] AS [C6],
[UnionAll1].[C4] AS [C7],
[UnionAll1].[C5] AS [C8],
[UnionAll1].[C6] AS [C9]
FROM  (SELECT
	[Project1].[C2] AS [C1],
	[Extent1].[x] AS [x],
	1 AS [C2],
	[Project1].[id] AS [id],
	[Project1].[id] AS [id1],
	[Project1].[C1] AS [C3],
	CAST(NULL AS int) AS [C4],
	CAST(NULL AS int) AS [C5],
	CAST(NULL AS varchar(1)) AS [C6]
	FROM  [dbo].[OneRowTable] AS [Extent1]
	LEFT OUTER JOIN  (SELECT
		[Extent2].[id] AS [id],
		[Extent2].[id] * 2 AS [C1],
		1 AS [C2]
		FROM [dbo].[a] AS [Extent2]
		WHERE ([Extent2].[x] IS NOT NULL) AND ([Extent2].[x] > 10) ) AS [Project1] ON 1 = 1
UNION ALL
	SELECT
	2 AS [C1],
	[Extent3].[x] AS [x],
	[Extent4].[id] AS [id],
	CAST(NULL AS int) AS [C2],
	CAST(NULL AS int) AS [C3],
	CAST(NULL AS int) AS [C4],
	[Extent4].[id] AS [id1],
	[Extent4].[id] AS [id2],
	[Extent4].[y] AS [y]
	FROM  [dbo].[OneRowTable] AS [Extent3]
	CROSS JOIN [dbo].[b] AS [Extent4]
	WHERE [Extent4].[id] < 999) AS [UnionAll1]
ORDER BY [UnionAll1].[x] ASC, [UnionAll1].[C1] ASC
```

Not exactly the original shape. The translator took another way creating two one row results and using `union all` to get it into one query. Except this, the query is in general the same (the explicit joins are as result same as the subselects, though little bit more confusing in this case).

Again, this isn't general purpose way of doing it and may result in worse performance than running queries separately and I would recommend using it only after careful testing and on controlled limited set of queries.