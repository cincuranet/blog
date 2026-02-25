---
title: |-
  Gotcha inserting entities with explicit ID generated in database in Entity Framework Core 2 compared to Entity Framework 6
date: 2017-09-14T08:38:00Z
tags:
  - Entity Framework
  - Entity Framework Core
  - MS SQL Server
---
Yesterday I was rewriting some code from Entity Framework 6 to Entity Framework 2 for testing and discovered unexpected behavior. Luckily, the code fails, so it's easy to detect.

<!-- excerpt -->

#### Entity Framework 6

In Entity Framework 6 you can create an entity and set the primary key property to whatever value you want, because in case the ID is generated in database (i.e. `identity` in MS SQL Server) the value will be overwritten anyway. And Entity Framework 6 will happily work with that scenario. You might wonder why would you set the property if it's going to be overwritten with real value? Maybe not intentionally, but you might be getting the objects from other system or source and the values might be set or something like that. Or as [Frans Bouma reminded me on Twitter][2], sometimes temporary primary keys are used for binding.

Simple program to try it.

```csharp
class Program
{
	static void Main(string[] args)
	{
		using (var db = new TestContext())
		{
			db.Database.Log = Console.WriteLine;

			try
			{
				db.Database.Delete();
				db.Database.Create();
				var e = new TestEntity() { Id = 6, Name = "foobar" };
				db.Set<TestEntity>().Add(e);
				db.SaveChanges();
				Console.WriteLine(e.Id);
			}
			finally
			{
				db.Database.Delete();
			}
		}
	}
}

class TestContext : DbContext
{
	public TestContext()
		: base(new SqlConnection(@"Data Source=(localdb)\mssqllocaldb;Initial Catalog=test;Integrated Security=True"), true)
	{ }

	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		var testEntityConf = modelBuilder.Entity<TestEntity>();
		testEntityConf.Property(x => x.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
	}
}

class TestEntity
{
	public int Id { get; set; }
	public string Name { get; set; }
}
```

The command that's executed is as expected.

```sql
INSERT [dbo].[TestEntities]([Name])
VALUES (@0)
SELECT [Id]
FROM [dbo].[TestEntities]
WHERE @@ROWCOUNT > 0 AND [Id] = scope_identity()
```

#### Entity Framework Core 2

If you do the same in Entity Framework Core 2 the behavior slightly changes.

```csharp
class Program
{
	static void Main(string[] args)
	{
		using (var db = new TestContext())
		{
			var factory = db.GetService<ILoggerFactory>();
			factory.AddConsole();

			try
			{
				db.Database.EnsureDeleted();
				db.Database.EnsureCreated();
				var e = new TestEntity() { Id = 6, Name = "foobar" };
				db.Add(e);
				db.SaveChanges();
				Console.WriteLine(e.Id);
			}
			finally
			{
				db.Database.EnsureDeleted();
			}
		}
	}
}

class TestContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		base.OnConfiguring(optionsBuilder);

		optionsBuilder.UseSqlServer(@"Data Source=(localdb)\mssqllocaldb;Initial Catalog=test;Integrated Security=True");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		var testEntityConf = modelBuilder.Entity<TestEntity>();
		testEntityConf.Property(x => x.Id).UseSqlServerIdentityColumn();
	}
}

class TestEntity
{
	public int Id { get; set; }
	public string Name { get; set; }
}
```

With this the code fails because it's executing following SQL.

```sql
SET NOCOUNT ON;
INSERT INTO [TestEntity] ([Id], [Name])
VALUES (@p0, @p1);
```

And because the `IDENTITY_INSERT` was not set.

This surprised me a little, because I was used to the behavior from Entity Framework 6. I don't know which behavior is better, probably depends on your expectations. In Entity Framework Core's repository there's a [ticket][1] (and bunch of related) for solving at least the fact that the provider might call the `SET IDENTITY_INSERT ON` and then `OFF` when it's doing this (although I know this has some challenges with multiple connections doing it).

#### Conclusion

Whatever side you pick, it's good to know about this behavior and act accordingly - either not explicitly setting the primary key (to non-default value) or using the `Database.ExecuteSqlCommand` to set/unset the ` IDENTITY_INSERT`.

#### Bonus: Entity Framework Core 2 without explicit ID

In case you're wondering about the command when the value is not explicitly set here it is.

```sql
SET NOCOUNT ON;
INSERT INTO [TestEntity] ([Name])
VALUES (@p0);
SELECT [Id]
FROM [TestEntity]
WHERE @@ROWCOUNT = 1 AND [Id] = scope_identity();
```

More or less the same as Entity Framework 6.

[1]: https://github.com/aspnet/EntityFrameworkCore/issues/703
[2]: https://twitter.com/FransBouma/status/908251145348501505