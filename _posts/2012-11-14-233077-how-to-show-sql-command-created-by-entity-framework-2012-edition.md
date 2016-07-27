---
title: "How to show SQL command created by Entity Framework? [2012 edition]"
date: 2012-11-14T11:17:13Z
tags:
  - Entity Framework
  - LINQ
redirect_from: /id/233077/
layout: post
---
Four years back (wow) I wrote a post about [how to show SQL command created by Entity Framework][1]. The information there still holds. But now it's 2012, Entity Framework progressed. Now you're probably using [`DbContext`][2] and [`IDbSet<T>`][3] APIs, it's actually recommended.

There you don't have the `ObjectQuery`. As the new API is simpler and more focused, also getting the command is simple. Simply call [`ToString()`][4] method and you're done.

```csharp
class Program
{
	static void Main(string[] args)
	{
		Database.SetInitializer<MyContext>(null);
		using (var ctx = new MyContext())
		{
			Console.WriteLine(ctx.FooBars.Where(x => x.Id == -1).ToString());
		}
	}
}
class MyContext : DbContext
{
	public IDbSet<FooBar> FooBars { get; set; }
}
class FooBar
{
	public int Id { get; set; }
	public string Baz { get; set; }
}
```

[1]: {{ site.address }}{% post_url 2008-05-26-227674-how-to-show-sql-command-created-by-entity-framework %}
[2]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.103).aspx
[3]: http://msdn.microsoft.com/en-us/library/gg679233(v=vs.103).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.infrastructure.dbquery.tostring(v=vs.103).aspx