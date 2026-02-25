---
title: |-
  Convenient method for explicit lazy loading in Entity Framework Core (or Entity Framework 6)
date: 2019-09-02T14:20:00Z
tags:
  - Entity Framework
  - Entity Framework Core
---
Last week I was explaining [explicit lazy loading][1] on Entity Framework Core and quite understandably the question came about shortening/encapsulating the code, because you might need to use it a lot in some cases. It's possible and luckily the method can also benefit from overload resolution in C# to handle reference and collection navigation properties transparently.

<!-- excerpt -->

It's pretty simple, just putting things together with correct signatures and calls. I decided to declare it on `DbContext` for convenience sake (although It could be also implemented for `ChangeTracker` or on some common interface for entities, if you have one).

```csharp
static class Ext
{
	public static void LoadRelated<TEntity, TReference>(this DbContext context, TEntity entity, Expression<Func<TEntity, TReference>> selector)
		where TEntity : class
		where TReference : class
	{
		var reference = context.Entry(entity).Reference(selector);
		if (!reference.IsLoaded)
			reference.Load();
	}
	public static void LoadRelated<TEntity, TReference>(this DbContext context, TEntity entity, Expression<Func<TEntity, IEnumerable<TReference>>> selector)
		where TEntity : class
		where TReference : class
	{
		var collection = context.Entry(entity).Collection(selector);
		if (!collection.IsLoaded)
			collection.Load();
	}
	public static void LoadRelated<TEntity, TReference>(this DbContext context, TEntity entity, Expression<Func<TEntity, ICollection<TReference>>> selector)
		where TEntity : class
		where TReference : class
	{
		LoadRelated(context, entity, Expression.Lambda<Func<TEntity, IEnumerable<TReference>>>(selector.Body, selector.Parameters));
	}
}
```

Also because the API surface (and behavior) in this area is same betwen Entity Framework 6 and Entity Framework Core, this code is going to work for both. 8-)

[1]: https://docs.microsoft.com/en-us/ef/core/querying/related-data#explicit-loading