---
title: |-
  Updating entity from DTO without fetching it
date: 2016-11-11T09:04:00Z
tags:
  - Entity Framework
---
Last week I was talking with colleague and we went deep into using DTOs for showing data effectively and also updating such data back. This topic itself could be discussed for hours. But what got my attention was whether I could make the update back to database from DTO a little bit more like if the change tracking was kickin' in automatically on tracked object.

<!-- excerpt -->

Of course that needs some manual work, because else the infrastructure does not know what was changed and what was not. You can of course handle it like everything was change, but that also means you have to construct complete entity from the DTO, which might not be possible because the DTOs often don't have all the data. Something like the idea for deletes without first fetching the entity, because you actually need just the ID.

So the flow in my head was like this.

* Fetch data into DTO.
* Change the DTO.
* Create stub entity from the DTO - basically just ID and changed values (this is where some automapper-like libraries help a lot).
* Update the entity (only the changed values, of course) using regular `SaveChanges`.

I knew it's not going to be some hacking, just regular use of change tracker. But I also wanted it to feel seamless. I was not sure whether the method should be on [`DbContext`][2] or [`DbEntityEntry<T>`][3]. At the end I chose `DbContext` because I felt hiding the [`Entry<T>`][4] call is helpful.

```csharp
public static void ApplySelectedValues<TEntity>(this DbContext context, TEntity entity, params Expression<Func<TEntity, object>>[] properties) where TEntity : class
{
	var entry = context.Entry(entity);
	entry.State = EntityState.Unchanged;
	foreach (var prop in properties)
	{
		entry.Property(prop).IsModified = true;
	}
}
```

As I said I, it's just a regular use of change tracker. To _attach_ the entity I set the `State` to `Unchanged`, thus I don't have to fiddle with `Attach` method. Then it's just simple loop over properties the caller declared to be modified and telling that to Entity Framework.

With this I can write code like this.

```csharp
using (var ctx = new MyContext())
{
	ctx.Database.Log = Console.WriteLine;
	var dto = new
	{
		Id = 25,
		A = 66,
	};
	// manual shoveling of the data
	var entity = new Entity()
	{
		Id = dto.Id,
		A = dto.A,
		B = default(int),
	};
	ctx.ApplySelectedValues(entity,
		x => x.A);
	ctx.SaveChanges();
}
```

And the generated update statement will update only the column `A`, leaving the `B` untouched, because `ApplySelectedValues` said only `A` was changed.

Honestly I thought it's going to be a little more fiddling. But simple code is a good code. Especially for people - not like me - not interested in fiddling.

[1]: {% include post_link id="233466" %}
[2]: https://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext%28v=vs.113%29.aspx
[3]: https://msdn.microsoft.com/en-us/library/gg696410(v=vs.113).aspx
[4]: https://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext.entry(v=vs.113).aspx#M:System.Data.Entity.DbContext.Entry``1%28``0%29 