---
title: "Load with filtering or limiting"
date: 2009-04-22T17:18:00Z
tags:
  - Entity Framework
  - LINQ
redirect_from: /id/229660/
layout: post
---
Today, you have two direct options how to load related data for given entity. Use [Include][1] or use [Load][2] method. In this post, I'll focus on Load, because this problem on Include is little bit easier than on Load. Unfortunately the Load method isn't providing any option to filter or limit what you're loading. That means, if you have customer with for example 200 invoices, you'll load all these 200 invoice, even if you need only first 5 or something like that. And that's wasting of resources.

But the solution isn't so hard. First, Entity Framewok has automagic wiring of related entities. Hence if you load one customer and then some invoices. If there will be invoices for this customer the navigation properties will be working without problem and without any work form you. So the first solution for filtered load is simply load detail record with your where condition and condition on the master entity. But that's "a lot" of work ;) and developers are lazy. Fortunately there's another way.

The EntityReference has a method [CreateSourceQuery][3] returning ObjectQuery. With this and knowledge from previous paragraph you can easily create overload/extension method for Load to load only what you need.

```csharp
public static void Load<T>(this EntityCollection<T> relatedEnd, Expression<Func<T, bool>> predicate, MergeOption mergeOption) where T : class, IEntityWithRelationships
{
	(relatedEnd.CreateSourceQuery().Where(predicate) as ObjectQuery<T>).Execute(mergeOption).ToArray();
}
public static void Load<T>(this EntityReference<T> relatedEnd, Expression<Func<T, bool>> predicate, MergeOption mergeOption) where T : class, IEntityWithRelationships
{
	(relatedEnd.CreateSourceQuery().Where(predicate) as ObjectQuery<T>).Execute(mergeOption).ToArray();
}
public static void Load<T>(this EntityCollection<T> relatedEnd, Expression<Func<T, bool>> predicate) where T : class, IEntityWithRelationships
{
	Load(relatedEnd, predicate, MergeOption.AppendOnly);
}
public static void Load<T>(this EntityReference<T> relatedEnd, Expression<Func<T, bool>> predicate) where T : class, IEntityWithRelationships
{
	Load(relatedEnd, predicate, MergeOption.AppendOnly);
}
```

Above is simple extension method, to help you load only related entities you need based on some where condition. You can take the same idea and create a version with First, for instance. Or any filter or limit you may need.

[1]: http://msdn.microsoft.com/en-us/library/bb738708.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb896375.aspx
[3]: http://msdn.microsoft.com/en-us/library/bb896328.aspx