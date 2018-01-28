---
title: |-
  Do attributes or fluent configurations take priority in Entity Framework Core?
date: 2018-01-29T08:43:00Z
tags:
  - Entity Framework Core
---
I was teaching my Entity Framework Core course last two days and question about priority of attributes' and configurations' priority came. Let's test it, shall we?

<!-- excerpt -->

#### tl;dr;

Fluent configurations override attributes.

#### Full story

The fastest way to test this, is to define conflicting mapping and see how the query will look like.

I defined simple [`DbContext`][1] and even simpler entity. The entity has [`Table`][5] attribute mapping it to one table and in [`OnModelCreating`][4] I map it to different table using [`ToTable`][2] method. Just for fun I also tried the same with properties/columns using [`Column`][6] and [`HasColumnName`][3] respectively. It would be weird would the behavior differ.

```csharp
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
		modelBuilder.Entity<TestEntity>()
			.ToTable("TableFromFluent")
			.Property(x => x.Name).HasColumnName("ColumnFromFluent");
	}
}

[Table("TableFromAttribute")]
class TestEntity
{
	public int Id { get; set; }
	[Column("ColumnFromAttribute")]
	public string Name { get; set; }
}
```

For testing I used the following code, without bothering about the database structure whatsoever. I'm interested in the query and I'm fine with the inevitable failure.

```csharp
using (var db = new TestContext())
{
	db.GetService<ILoggerFactory>().AddConsole();
	db.Set<TestEntity>().Load();
}
```

The important part of log.

```text
fail: Microsoft.EntityFrameworkCore.Database.Command[20102]
      Failed executing DbCommand (6ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT [t].[Id], [t].[ColumnFromFluent]
      FROM [TableFromFluent] AS [t]
```

One can clearly see the table name as well as the column name are the ones from fluent configurations, not the ones used in attributes.

This makes perfect sense. You should be able to change in your configuration whatever was defined elsewhere where you might not be able or allowed to change it.

[1]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext?view=efcore-2.0
[2]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.relationalentitytypebuilderextensions.totable?view=efcore-2.0#Microsoft_EntityFrameworkCore_RelationalEntityTypeBuilderExtensions_ToTable_Microsoft_EntityFrameworkCore_Metadata_Builders_EntityTypeBuilder_System_String_
[3]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.relationalpropertybuilderextensions.hascolumnname?view=efcore-2.0#Microsoft_EntityFrameworkCore_RelationalPropertyBuilderExtensions_HasColumnName__1_Microsoft_EntityFrameworkCore_Metadata_Builders_PropertyBuilder___0__System_String_
[4]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext.onmodelcreating?view=efcore-2.0#Microsoft_EntityFrameworkCore_DbContext_OnModelCreating_Microsoft_EntityFrameworkCore_ModelBuilder_
[5]: https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.schema.tableattribute%28v=vs.110%29.aspx
[6]: https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.schema.columnattribute%28v=vs.110%29.aspx