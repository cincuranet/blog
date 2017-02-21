---
title: |
  Disappearing order by clauses when composing query
date: 2010-10-07T11:23:09Z
tags:
  - LINQ
layout: post
---
If you're composing queries in LINQ on various places, utilizing the delayed execution, you might be surprised, that some of your dynamically added [OrderBy][1]s are not in final query.

Imagine we have a simple table with `a` and `b` columns (and primary key). If you write following query with ordering adding (it can be in different method etc.) ...

```csharp
IQueryable<OrderingTest> tmp1 = context.OrderingTest;
tmp1 = tmp1.OrderBy(x => x.a);
tmp1 = tmp1.OrderBy(x => x.b);
//Console.WriteLine((tmp1 as ObjectQuery).ToTraceString());
```

... the result will contain sorting based only on `b` column. That's because the last `OrderBy` took the precedence.

To make it work as expected you have to write it like this.

```csharp
IQueryable<OrderingTest> tmp2 = context.OrderingTest;
tmp2 = tmp2.OrderBy(x => x.a);
if (tmp2 is IOrderedQueryable<OrderingTest>)
	tmp2 = (tmp2 as IOrderedQueryable<OrderingTest>).ThenBy(x => x.b);
//Console.WriteLine((tmp2 as ObjectQuery).ToTraceString());
```

The secondary (and further ordering) needs to be done via [ThenBy][2] method, which is available on [IOrderedQueryable<T>][3]. That's the reason for casting.

Sure it's always safer to do this in one place directly, but sometimes the query is and has to be build on various places. Then think if a call to `OrderBy` could or couldn't be at some place before.

You can always do some "dummy sort", like `_ => 0`, initially and then use only `ThenBy`, but I personally don't like playing with the intelligence of optimizer. It may have bad impact on performance.

[1]: http://msdn.microsoft.com/en-us/library/system.linq.queryable.orderby.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.linq.queryable.thenby.aspx
[3]: http://msdn.microsoft.com/en-us/library/bb340178.aspx