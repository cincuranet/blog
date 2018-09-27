---
title: |-
  Deleting entity in Entity Framework only by key without fetching it
date: 2014-07-03T07:42:00Z
tags:
  - Entity Framework
---
I was showing today on my [Entity Framework][3] [course][4] some tips and one of them was how to delete entity when you only have a key without fetching it first. Kind of small optimization. And then my brain started to think whether I can do it completely dynamically – just having the type of entity and values of key properties.

I "knew" I can do it. It was just a question of how deep I'll have to dig. Surprisingly it's not that bad.

<!-- excerpt -->

But first thing first. When you want to delete entity, you have to have the instance of it and then you can the [`Remove`][1] method on [`DbSet`][2]. If you don't have the instance, fetching it seems to be waste of resource given you want to delete it immediately, right? Truth is Entity Framework needs only the key(s) to delete the entity, nothing more (and possibly fields used for concurrency check - I'll ignore these in following lines).

So what you can, in fact, do is trick Entity Framework thinking it has the instance but providing only the stub. Here's the example.

```csharp
public static void RemoveUsingStub1<TEntity>(this IDbSet<TEntity> dbSet, TEntity stub) where TEntity : class
{
	dbSet.Attach(stub);
	dbSet.Remove(stub);
}
```  

If you rather like to trick "change tracker", you can.

```csharp
public static void RemoveUsingStub2<TEntity>(this DbContext dbContext, TEntity stub) where TEntity : class
{
	dbContext.Entry(stub).State = EntityState.Deleted;
}
```

The result is the same. But these methods are forcing you to create the entity and set the key(s). The caller needs to know how this works. Can I do better? Can I just ask for keys and type and that's it? Here's the final version. It's defined for [`DbContext`][5] because I need it to get the keys. It's possible to define if for `DbSet` but then you need to use [reflection][6] to get the `DbContext` and this might change in the future, so I rather took the safer path.

```csharp
public static void RemoveUsingStub3<TEntity>(this DbContext dbContext, params object[] entityKeys) where TEntity : class, new()
{
	var oc = (dbContext as IObjectContextAdapter).ObjectContext;
	var stub = new TEntity();
	var keys = oc.CreateObjectSet<TEntity>().EntitySet.ElementType.KeyMembers.Select(x => x.Name);
	var keyProperties = keys.Select(k => typeof(TEntity).GetProperty(k));
	foreach (var item in keyProperties.Zip(entityKeys, (pi, value) => new { Property = pi, Value = value }))
	{
		item.Property.SetValue(stub, item.Value);
	}
	dbContext.Set<TEntity>().Attach(stub);
	dbContext.Set<TEntity>().Remove(stub);
}
```  	

The code firsts gets the key names for given entity and then sets the values on that properties to a values received in 2^nd^ parameter. Finally it uses the same approach as the first method to [`Attach`][7] and `Remove` the stub. Of course using the approach from second method is possible as well.

At the end I have a mixed feelings. I'm glad it was fairly easy to dig out what was needed. But on the other hand I'd like the method to be on `DbSet` or rather [`IDbSet`][8], but then the method, as I wrote above, needs to use reflection to get some internal fields and that's not nice, I think. I would use it only as  a last chance. Anyway I was a nice brain training. If you think you'd use it, be my guest.

> [Related post.][9]

[1]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbset.remove(v=vs.113).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbset(v=vs.113).aspx
[3]: http://msdn.com/ef
[4]: http://www.x2develop.com
[5]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.113).aspx
[6]: http://en.wikipedia.org/wiki/Reflection_(computer_programming)
[7]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbset.attach(v=vs.113).aspx
[8]: http://msdn.microsoft.com/en-us/library/gg679233(v=vs.113).aspx
[9]: {% include post_link, id: "233584" %}