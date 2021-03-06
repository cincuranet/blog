---
title: |-
  Compare NULLs in database as in C# in Entity Framework
date: 2012-04-23T10:10:30Z
tags:
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - LINQ
---
Roughly two years ago I blogged about [differences in NULLs handling in databases and in (some) programming languages (C# in particular)][1]. But Entity Framework 5 (in .NET 4.5) ([lost?][2]) comes with handy switch. It's [`UseCSharpNullComparisonBehavior`][3]. What this basically does is ensure when you compare nullable fields to be handled like in C#, aka `null == null` and not like in SQL where NULL compared to anything is NULL or false when boolean value is needed.

Let's have a look at the diffences. Simple code:

```csharp
int? i = default(int);
using (testEntities c = new testEntities())
{
	c.ContextOptions.UseCSharpNullComparisonBehavior = true;
	Console.WriteLine((c.Details.Where(x => x.MasterID != i) as ObjectQuery).ToTraceString());
}
using (testovaciEntities c = new testovaciEntities())
{
	c.ContextOptions.UseCSharpNullComparisonBehavior = false;
	Console.WriteLine((c.Details.Where(x => x.MasterID != i) as ObjectQuery).ToTraceString());
}
```

The first query creates "magic" SQL:

```sql
SELECT
[Extent1].[ID] AS [ID],
[Extent1].[ID_MASTER] AS [ID_MASTER],
[Extent1].[BAR] AS [BAR]
FROM [dbo].[DETAIL] AS [Extent1]
WHERE  NOT ((([Extent1].[ID_MASTER] = @p__linq__0) AND ( NOT ([Extent1].[ID_MASTER] IS NULL OR @p__linq__0 IS NULL))) OR (([Extent1].[ID_MASTER] IS NULL) AND (@p__linq__0 IS NULL)))
```

While the other expected one:

```sql
SELECT
[Extent1].[ID] AS [ID],
[Extent1].[ID_MASTER] AS [ID_MASTER],
[Extent1].[BAR] AS [BAR]
FROM [dbo].[DETAIL] AS [Extent1]
WHERE [Extent1].[ID_MASTER] <> @p__linq__0
```

What the first one is doing is handling the case where C# null (in parameter) can be compared to database NULL to fix-up the logic.

If you're not familiar with NULLs in database this can be tricky to handle correctly, especially if you have [negations][4], [All][5]s and [Any][6]s nested inside query. Hence setting this property to `true` can save you hours of debugging and wondering what's going on.

[1]: {{ include "post_link" 231185 }}
[2]: {{ include "post_link" 232675 }}
[3]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontextoptions.usecsharpnullcomparisonbehavior(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/f2kd6eb2.aspx
[5]: http://msdn.microsoft.com/en-us/library/bb534754.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.linq.queryable.any.aspx