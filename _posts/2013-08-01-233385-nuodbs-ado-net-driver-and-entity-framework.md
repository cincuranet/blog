---
title: "NuoDB's ADO.NET driver and Entity Framework"
date: 2013-08-01T16:30:08Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Entity SQL
  - LINQ
  - NewSQL
  - NoSQL
  - NuoDB
  - SQL
  - Visual Studio
redirect_from: /id/233385/
category: none
layout: post
---
I recently started working on [NuoDB's .NET driver][1] to improve it and especially to introduce Entity Framework support. I was playing with NuoDB before, even from .NET, but [using only ODBC that was available at that time][2]. Currently good pure .NET driver is available and now it has even full [Entity Framework][3] support.

<!-- excerpt -->

When I was working on it, the main focus was to deliver the most valuable parts to developers. That means the driver currently target's .NET Framework 4.0 (or newer) and Entity Framework 4 and 5. I think that's majority of today's usage.

You can expect full support for using Entity Framework with Entity Data Model as EDMX file or via Code First. No need to make decisions. Of course full LINQ support to the extent what is supported by NuoDB itself.

If you want to go further I recommend heading the download page and getting the latest ADO.NET driver for NuoDB and referencing it from your project. Enjoy the ride.

I'll first create a simple application that accesses the data in NuoDB's standard Hockey database. I'll be using Code First, because then you can see all the code and you don't have to fiddle with creating EDMX file etc.

Some basic structures:

```csharp
class HockeyContext : DbContext
{
	public HockeyContext()
		: base(new NuoDbConnection(Data.ConnectionString), true)
	{ }

	public DbSet<Hockey> Hockey { get; set; }

	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		var hockeyConf = modelBuilder.Entity<Hockey>();
		hockeyConf.HasKey(x => x.Id);
		hockeyConf.Property(x => x.Id).HasColumnName("ID").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
		hockeyConf.Property(x => x.Number).HasColumnName("NUMBER");
		hockeyConf.Property(x => x.Name).IsRequired().HasColumnName("NAME");
		hockeyConf.Property(x => x.Position).IsRequired().HasColumnName("POSITION");
		hockeyConf.Property(x => x.Team).IsRequired().HasColumnName("TEAM");
		hockeyConf.ToTable("HOCKEY", "USER");
	}
}

class Hockey
{
	public int Id { get; set; }
	public int Number { get; set; }
	public string Name { get; set; }
	public string Position { get; set; }
	public string Team { get; set; }
}
```

I'm here overriding the OnModelCreating to specify the mapping to the database (and even explicitly setting the information about the key, though the default convention would match it). If you've ever used Entity Framework and Code First this should be familiar to you.

Now some code to actually do something:

```csharp
using (var ctx = new HockeyContext())
{
	var longestNames = ctx.Hockey.OrderByDescending(x => x.Name.Length).Select(x => x.Name).Take(3);
	Console.WriteLine("Top 3 longest name has:");
	foreach (var item in longestNames)
		Console.WriteLine(item);
	Console.WriteLine("===");

	foreach (var item in ctx.Hockey)
	{
		Console.WriteLine("{0,2}: {1,-20}\t{2}", item.Number, item.Name, item.Team);
	}
	Console.WriteLine("===");

	foreach (var item in "NuoDB")
	{
		var letter = item.ToString().ToUpper();
		var query = ctx.Hockey.Where(x => x.Name.ToUpper().Contains(letter)).Select(x => x.Name);
		Console.WriteLine(query);
		Console.WriteLine("Players starting with '{0}':", letter);
		foreach (var name in query)
			Console.WriteLine(name);
		Console.WriteLine();
	}
	Console.WriteLine("===");
}
```

This code issues few queries to the database using some orderings, projections and filters. The last batch of code also prints the query being executed to the console, so you can see it and compare it with what you might write. The query looks like:

```sql
SELECT
"Extent1"."NAME" AS "NAME"
FROM "USER"."HOCKEY" AS "Extent1"
WHERE UPPER("Extent1"."NAME") LIKE ?.p__linq__0 ESCAPE '\'
```

Which is more or less what I would have write myself.

We can also have a fun with updates, deletes and inserts. What about reversing all the team names?:

```csharp
foreach (var item in ctx.Hockey)
{
	item.Team = new string(item.Team.Reverse().ToArray());
}
var newHockey = new Hockey() { Name = "Test", Number = 10, Position = "Test", Team = "Test" };
ctx.Hockey.Add(newHockey);
ctx.SaveChanges();
Console.WriteLine(newHockey.Id);
```

It works again as expected. No nasty surprise. So let's move to final step and try to dig little bit into infrastructure. Often you have your model and you'd like to create from it a database script (which you can then send to i.e. your DBA do review it and execute it). Note: I'm here not using Entity Framework's Migrations, which is another way to create a database script and – more importantly – also upgrade the database(s) creating alter scripts automatically.

To see how some general data types are handled, I created this structure:

```csharp
class SampleNewDatabaseContext : DbContext
{
	public SampleNewDatabaseContext()
		: base(new NuoDbConnection(Data.ConnectionString), true)
	{ }

	public DbSet<SomeEntity> SomeEntities { get; set; }

	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		modelBuilder.Entity<SomeEntity>().ToTable("TEST_TABLE", "USER");
	}
}

class SomeEntity
{
	public long Id { get; set; }
	public Guid Guid { get; set; }
	public string S { get; set; }
	public double D { get; set; }
}
```

Maybe you know, NuoDB currently does not have native support for Guid data type, but I did some extra work so you can save and read this basic data type without any hassle. If you run this code:

```csharp
using (var ctx = new SampleNewDatabaseContext())
{
	Console.WriteLine(((IObjectContextAdapter)ctx).ObjectContext.CreateDatabaseScript());
}
```

You'll get back the script:

```sql
CREATE TABLE "USER"."TEST_TABLE" (
        "Id" BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
        "Guid" CHAR(38) NOT NULL,
        "S" CLOB,
        "D" DOUBLE PRECISION NOT NULL
);
ALTER TABLE "USER"."TEST_TABLE" ADD PRIMARY KEY ("Id");
```

Of course if you'd provide some more mapping details in OnModelCreating the script would be different, so you might for instance add some length limit to the `S` property so it ends up being `varchar(x)` for example.

I hope you enjoyed this quick overview of NuoDB's Entity Framework support and you'll grab the bytes and play with it.

> Written for [NuoDB's Techblog][4].

[1]: http://www.nuodb.com/devcenter/
[2]: {{ site.url }}{% post_url 2012-05-21-232841-using-nuodb-from-net %}
[3]: http://msdn.com/ef
[4]: http://www.nuodb.com/techblog/2013/08/01/nuodb-dotnet-driver-offers-entity-framework-support/