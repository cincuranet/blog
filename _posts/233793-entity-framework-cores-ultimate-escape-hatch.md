---
title: |-
  Entity Framework Core's ultimate escape hatch
date: 2019-08-14T14:30:00Z
tags:
  - Entity Framework
  - Entity Framework Core
---
In 2007 then Principal Software Architect on Data Programmability team Mike Pizzo wrote in a ["random" forum reply][1] about Entity Framework's `DefiningQuery` being the "ultimate escape hatch". This was later mentioned in Julia Lerman's famous book [Programming Entity Framework][4]. Just to make sure you understand this archeology (and yes, I spent quite some time digging the reply back - kudos to MSDN forum people keeping it still running), Entity Framework (the first version) was released in 2008.

<!-- excerpt -->

> Actually, we can add mapping in the MSL through EntitySQL Views, but they key differentiator that makes the DefiningQuery feature so powerful is that it's done in terms of a native store query.  So whatever query you can execute in the store, you can represent as a (read-only) table in the SSDL, and the rest of the entity framework treats it just like any other table/view.  For example, with DefiningQuery, you can map multiple entities to the same table outside of a type hierarchy, or a single entity to multiple rows within a single table (I did a demo at TechEd where I mapped an "Activity" Entity to a Sharepoint schema in which the properties of the Activity were actually mapped to different rows within a single "universal" table according to a row ordinal).  The list goes on... In fact, every time I think I've found a mapping scenario that we don't support in Entity Framework 1.0, I find a way to do it using DefiningQuery...
>
> So yes, you should use MSL to do mapping between the store schema and the conceptual schema where possible in order to leverage the full power of client views for querying and updating, but DefiningQuery provides an ultimate escape hatch for cases where the mapping is too complex to define in MSL, even through an EntitySQL view.

The `DefiningQuery` is long forgotten and probably only few people on the planet know about it (not that it was that known at that time). But one feature in "new" Entity Framework Core, brings that feel back to me. It's [Query Types] (or [Keyless Entity Types in upcoming Entity Framework Core 3.0][3]). It's not the same feature, but the versatility of Query Types is something that's often overlooked.

Let me tell you why. Although there's bunch of usages, and you can see those in documentation, one in particular I like to show. Whenever I'm teaching one of my Entity Framework (Core) courses or speaking on a conference, I'm trying to tell people that the ORM is not the single path they have to choose. For two reasons. 

Nothing beats handcrafted SQL query in terms of performance or feature availability from the database engine itself. And understanding, at least on a basic level, SQL and execution plans helps preventing performance issues with using ORM. And once you are in a need for performance and/or some database engine feature (which usually goes hand in hand with performance) you can do it with Query Types. 

Just take raw handcrafted SQL and "map" it to the result.

```csharp
using (var db = new MyContext())
{
	db.Query<FooBar>().FromSql("select a, b, c from FooBar where x = SomeSQLMagic(y) and SomeMoreSQLMagic");
}
```

That's it. Now you have all the power of SQL, and remember ["Modern SQL Databases Come up with Algorithms that You Would Have Never Dreamed Of"][5], so why to limit ourselves. Also, you get back objects, which in object-oriented program is quite handy and very likely why you're using ORM.

And that's why I consider it the ultimate escape hatch of Entity Framework Core.

[1]: https://social.msdn.microsoft.com/Forums/en-US/79b9cb48-680d-4d2c-9335-601b9b0d51ff/defining-queries?forum=adodotnetentityframework
[2]: https://docs.microsoft.com/en-us/ef/core/modeling/query-types
[3]: https://github.com/aspnet/EntityFrameworkCore/issues/14194
[4]: http://shop.oreilly.com/product/9780596520298.do
[5]: https://www.youtube.com/watch?v=wTPGW1PNy_Y