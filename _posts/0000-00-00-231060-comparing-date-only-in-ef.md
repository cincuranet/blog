---
title: |-
  Comparing date only in EF
date: 2009-11-24T14:52:11Z
tags:
  - Entity Framework
  - Entity SQL
  - LINQ
---
From time to time you may need to compare only date part of datetime/timestamp field in your database i.e. for filtering. In EFv1 this is a little bit problem, in EFv4 (now beta 2) better.

Let's start with EFv1. If you try to write something like this:

```csharp
.Where(x => x.DateTimeColumn.Date == DateTime.Today)
```

You'll end up with nice exception. Simply EF is not able to translate it. To solve this problem I created handy (for me) method, that will do simply expansion comparing Day, Month, Year, so you don't have to write it over and over again.

```csharp
public static Expression<Func<TElement, bool>> DateEqual<TElement>(Expression<Func<TElement, DateTime>> valueSelector, DateTime dt)
{
	if (valueSelector == null)
		throw new ArgumentException("valueSelector");
	ParameterExpression p = valueSelector.Parameters.Single();
	Expression ex = Expression.And(
		Expression.Equal(
			Expression.MakeMemberAccess(valueSelector.Body, typeof(DateTime).GetMember("Day").Single()),
			Expression.Constant(dt.Day)
			),
		Expression.And(
			Expression.Equal(
				Expression.MakeMemberAccess(valueSelector.Body, typeof(DateTime).GetMember("Month").Single()),
				Expression.Constant(dt.Month)
				),
			Expression.Equal(
				Expression.MakeMemberAccess(valueSelector.Body, typeof(DateTime).GetMember("Year").Single()),
				Expression.Constant(dt.Year)
				)
			)
		);
	return Expression.Lambda<Func<TElement, bool>>(ex, p);
}
```

So you can write i.e.:

```csharp
.Where(Ext.DateEqual<DateTimeEntity>(x => x.DateTimeColumn, DateTime.Today.AddDays(-20)))
```

One modification I have in my head, is to extend it to support comparing two columns in database. But that shouldn't be hard.

On the other hand, EFv4 contains couple of new [canonical functions][1], for datetime/timestamp as well. One that's useful for this case is [TruncateTime][2], also exported for LINQ usage with [EdmFunctionAttribute][3]. With it, you can write queries little bit easier. Still not directly `.Date`, but i.e.:

```csharp
.Where(x => EntityFunctions.TruncateTime(x.DateTimeColumn) == DateTime.Today)
```

Comparing two columns is available too. Sure, your provider needs to support this new function, but that should be no problem for all provider writers.

Maybe the future EF improvement could be to support `.Date` for translation too. ;)

[1]: http://msdn.microsoft.com/en-us/library/bb738563(VS.100).aspx
[2]: http://msdn.microsoft.com/en-us/library/dd395596(VS.100).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.edmfunctionattribute(VS.100).aspx