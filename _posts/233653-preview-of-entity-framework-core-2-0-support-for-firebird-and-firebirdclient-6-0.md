---
title: |-
  Preview of Entity Framework Core 2.0 support for Firebird (and FirebirdClient 6.0)
date: 2017-10-13T13:15:00Z
tags:
  - .NET
  - .NET Standard
  - C#
  - Databases in general
  - Entity Framework Core
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
---
Just before the end of the week I have a toy for you for the weekend. Yes you see it correctly - Entity Framework Core 2.0 support for Firebird. And together with that preview of FirebirdClient 6.0, which contains heaps of changes as well.

<!-- excerpt -->

Let's start with the facts. This is a `alpha1` version, which means things can go very bad. Be prepared.

#### Entity Framework Core 2.0 support

Entity Framework Core 2.0 support works in the basic scenarios. I still need to polish some edge cases add more tests and of course there's always room for improvements (like batching which is currently not supported). Of course I'd be glad if you report pieces where it falls flat so for final version everything will be smooth. [Get it from NuGet][1] while it's hot.

Two big features are missing - migrations and scaffolding. These will come in next version/preview. 

This feature could not happen without support from [Integrative9 Enneagram Solutions][4] and contributions by [@ralmsdeveloper][6] and [@souchprod][5].

A small demo, to give you a head start, is provided below.

#### FirebirdClient 6.0 

The next big version of FirebirdClient is going to be [version 6.0][2]. It contains quite a few breaking changes and also improvements (some for EF Core support too (so you need this version if you plan to test EF Core)). I'm providing it in preview so you can test it and prepare for the upgrade. All the changes are continuously tracked in the [6.0.0.0 version][3] in the tracker (the list might grow before the final release).

If you find some road block, again, report it.

#### Entity Framework Core 2.0 for Firebird demo

Put this into your `csproj`.

```xml
<Project Sdk="Microsoft.NET.Sdk">
	<PropertyGroup>
		<OutputType>Exe</OutputType>
		<TargetFramework>netcoreapp2.0</TargetFramework>
		<NoWarn>$(NoWarn);NU1605</NoWarn>
	</PropertyGroup>
	<ItemGroup>
		<PackageReference Include="Microsoft.Extensions.Logging.Console" Version="2.0.0" />
		<PackageReference Include="FirebirdSql.Data.FirebirdClient" Version="6.0.0-alpha1" />
		<PackageReference Include="FirebirdSql.EntityFrameworkCore.Firebird" Version="6.0.0-alpha1" />
	</ItemGroup>
</Project>
```

And a simple code.

```csharp
class Program
{
    static void Main(string[] args)
    {
		using (var db = new DemoDbContext())
		{
			db.GetService<ILoggerFactory>().AddConsole();
			var data = db.Set<MonAttachment>()
				.Where(x => x.AttachmentName.Trim() != string.Empty && x.Timestamp.Second > -1)
				.ToList();
			foreach (var item in data)
			{
				Console.WriteLine($"{item.AttachmentId}: {item.AttachmentName} ({item.Timestamp})");
			}
		}
	}
}

class DemoDbContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseFirebird(@"database=localhost:test.fdb;user=sysdba;password=masterkey");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		var monAttachmentConf = modelBuilder.Entity<MonAttachment>();
		monAttachmentConf.HasKey(x => x.AttachmentId);
		monAttachmentConf.Property(x => x.AttachmentId).HasColumnName("MON$ATTACHMENT_ID");
		monAttachmentConf.Property(x => x.AttachmentName).HasColumnName("MON$ATTACHMENT_NAME");
		monAttachmentConf.Property(x => x.Timestamp).HasColumnName("MON$TIMESTAMP");
		monAttachmentConf.ToTable("MON$ATTACHMENTS");
	}
}

class MonAttachment
{
	public int AttachmentId { get; set; }
	public string AttachmentName { get; set; }
	public DateTime Timestamp { get; set; }
}
```

[1]: https://www.nuget.org/packages/FirebirdSql.EntityFrameworkCore.Firebird/6.0.0-alpha1
[2]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/6.0.0-alpha1
[3]: http://tracker.firebirdsql.org/browse/DNET/fixforversion/10850
[4]: https://www.integrative9.com/
[5]: https://github.com/souchprod
[6]: https://github.com/ralmsdeveloper