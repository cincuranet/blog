---
title: |-
  Entity Framework 6 with Firebird
date: 2013-10-23T13:25:00Z
tags:
  - C#
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - .NET
layout: post
---
> This post is outdated. Read the [updated version][5].

Looks like a lot of people is trying [Entity Framework 6][1] together with [Firebird][2]. I like it. And though it's not a difficult or tricky task, if you're not familiar with Entity Framework's 6 changes you might be caught off guard.

<!-- excerpt -->

So first thing first. I suppose you have nothing related to [ADO.NET provider for Firebird][3] installed (and you don't have to). So install Entity Framework package.

```text
install-package EntityFramework
```

Then install provider. Here you need to be careful and install the "EF6 version" as the provider model was changed in Entity Framework 6. It's called `FirebirdSql.Data.FirebirdClient-EF6`.

```text
install-package FirebirdSql.Data.FirebirdClient-EF6
```

Now you need to tell Entity Framework to know about `FirebirdClient`. You need to add record into `DbProviderFactories`. This references `FirebirdSql.Data.FirebirdClient.FirebirdClientFactory`. And then you need to register the provider `entityFramework` section in `providers`. This references `FirebirdSql.Data.FirebirdClient.FbProviderServices`. The standard config file with these changes made follows.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
	<configSections>
		<!-- For more information on Entity Framework configuration, visit http://go.microsoft.com/fwlink/?LinkID=237468 -->
		<section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false"/>
	</configSections>
	<startup>
		<supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.1"/>
	</startup>
	<system.data>
		<DbProviderFactories>
			<add name="FirebirdClient Data Provider" invariant="FirebirdSql.Data.FirebirdClient" description=".NET Framework Data Provider for Firebird" type="FirebirdSql.Data.FirebirdClient.FirebirdClientFactory, FirebirdSql.Data.FirebirdClient"/>
		</DbProviderFactories>
	</system.data>
	<entityFramework>
		<defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
			<parameters>
				<parameter value="v11.0"/>
			</parameters>
		</defaultConnectionFactory>
		<providers>
			<provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer"/>
			<provider invariantName="FirebirdSql.Data.FirebirdClient" type="FirebirdSql.Data.FirebirdClient.FbProviderServices, FirebirdSql.Data.FirebirdClient"/>
		</providers>
	</entityFramework>
</configuration>
```

And you're done. To quickly test it, create an empty database and try this code (you might need to change the connection string).

```csharp
class Program
{
	static void Main(string[] args)
	{
		Database.SetInitializer<MyContext>(null);
		using (var ctx = new MyContext())
		{
			var data = ctx.MONDatabase.First();
			Console.WriteLine("Name:{0}\t{1}", Environment.NewLine, data.DatabaseName);
			Console.WriteLine("CreationName:{0}\t{1}", Environment.NewLine, data.CreationDate);
		}
	}
}

class MyContext : DbContext
{
	public MyContext()
		: base(new FbConnection(@"database=localhost:test.fdb;user=sysdba;password=masterkey"), true)
	{ }

	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		var monDatabaseConfiguration = modelBuilder.Entity<MONDatabase>();
		monDatabaseConfiguration.HasKey(x => x.DatabaseName);
		monDatabaseConfiguration.Property(x => x.DatabaseName).HasColumnName("MON$DATABASE_NAME");
		monDatabaseConfiguration.Property(x => x.CreationDate).HasColumnName("MON$CREATION_DATE");
		monDatabaseConfiguration.ToTable("MON$DATABASE");
	}

	public DbSet<MONDatabase> MONDatabase { get; set; }
}

class MONDatabase
{
	public string DatabaseName { get; set; }
	public DateTime CreationDate { get; set; }
}
```

If you want, you can download it as a complete solution [here][4].

You might want to use the Entity Framework's designer for instance and use DDEX in which case you need to install some other parts, but the core concept is the same. Once you understand these few steps (try changing or not doing something to see what goes wrong) you should have no problems doing it.

As I said, nothing difficult, isn't it?

[1]: http://msdn.com/ef
[2]: http://www.firebirdsql.org
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: https://github.com/cincuranet/EF6_Firebird
[5]: {% include post_link id="233472" %}