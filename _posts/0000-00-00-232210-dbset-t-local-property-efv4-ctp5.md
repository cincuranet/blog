---
title: |-
  DbSet<T>.Local property (EFv4, CTP5)
date: 2010-12-09T13:19:15Z
tags:
  - Entity Framework
layout: post
---
Currently latest CTP for Entity Framework, [CTP5][1], contains one new property on DbSet<T>. It's called `Local` and it's very useful when you wanna work with objects you have already in memory. So it's good for queries without hitting the database, like databinding.

You can create layer that loads objects your application needs, or you think it might need. And then you use only `.Local` to access that data, still full LINQ support etc. This may help to lower number of queries you're sending to database. The property is of type ObservableCollection<T>, thus the databinding is super easy.

The method isn't something new. In fact it's exposing in a friendly was what's already possible - i.e. [Useful Find method on DbSet][2] and ["Local" Queries 2nd edition][3]. It is using [ObjectStateManager][4] to find all Unchanged, Added and Modified entities, exactly the ones you're probably interested in.

Let's see some example:

```csharp
class Program
{
	static void Main(string[] args)
	{
		/*
		 * I have 3 rows in FOOBAR table in database.
		 */
		using (MyContext c = new MyContext())
		{
			// return's 2 rows and hits database
			var data1 = c.Set<FooBar>().OrderBy(x => x.ID).Take(2).ToArray();
			// return's 2 rows without hitting database
			var data2 = c.Set<FooBar>().Local.ToArray();
			// return's 1 row and hits database
			var data3 = c.Set<FooBar>().OrderBy(x => x.ID).Skip(2).Take(1).ToArray();
			// return's 3 rows without hitting database
			var data4 = c.Set<FooBar>().Local.ToArray();
		}
	}
}
class MyContext : DbContext
{
	public MyContext()
		: base(new FbConnection("database=localhost:rrr.fdb;user=sysdba;password=masterkey"), true)
	{ }
	protected override void OnModelCreating(System.Data.Entity.ModelConfiguration.ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		modelBuilder.Entity<FooBar>().HasKey(x => x.ID);
		modelBuilder.Entity<FooBar>().Property(x => x.ID).HasColumnName("ID");
		modelBuilder.Entity<FooBar>().Property(x => x.Something).HasColumnName("S");
		modelBuilder.Entity<FooBar>().Map(m => m.ToTable("FOOBAR"));
	}
}
class FooBar
{
	public int ID { get; set; }
	public string Something { get; set; }
}
```

All important stuff about behavior is in comments. As you see, it acts as kind of local cache of objects, that are (mostly) reasonable to work with.

As always, nothing huge, but nice, handy.

PS: Did you noticed, I'm using [Firebird][5]? ;)

[1]: http://www.microsoft.com/downloads/en/details.aspx?FamilyID=35adb688-f8a7-4d28-86b1-b6235385389d
[2]: {% post_url 0000-00-00-231816-useful-find-method-on-dbset %}/
[3]: {% post_url 0000-00-00-229047-local-queries-2nd-edition %}/
[4]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectstatemanager.aspx
[5]: http://www.firebirdsql.org/