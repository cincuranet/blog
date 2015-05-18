---
title: "Custom conventions in Entity Framework 6 helping Firebird"
date: 2013-03-06T16:59:58Z
tags:
  - Entity Framework
  - Firebird
redirect_from: /id/233167
category: none
layout: post
---
> [There's a part 2 of this story.][1]
> [Follow-up post.][4]

The next version of Entity Framework, version 6, has a nice new feature [Custom Code First Conventions][2]. In short you can create your own conventions and using these together with the default ones (these were there before). Does you primary key column/property always ends up `_PK`? You can create convention for that and completely remove bunch of `HasKey()` lines. But that's not what I'm going to talk about, if you want to know more follow the link above.

<!-- excerpt -->

[Firebird][3] as other databases adhering to SQL standard in naming and quotations treats unquoted column/table/... as upper case. A lot of ORMs normally quote everything, just to be safe and because it's easier than to hunt all the exceptions and places where it might collide with reserved keywords. I'm doing that too in provider for Entity Framework for Firebird. That means, that if you create some Code First model, the SQL statements will be quoted and using default naming convention - that's, simply speaking, same as property/class/... name. Not good. You have to write a lot of explicit `HasColumnName`.

But with custom conventions today, you can save your typing. Let's say, that my naming convention is like this. Property `SomeValue` goes to column `SOME_VALUE`. So it's upper case, words separated by underscores. In fact that's very close to what majority of Firebird users use.

<pre class="brush:csharp">
public static string CreateName(string s)
{
	return s.Aggregate(string.Empty, (acc, c) =&gt; acc + (char.IsUpper(c) &amp;&amp; !string.IsNullOrEmpty(acc) ? "_" + c : char.ToUpperInvariant(c).ToString()), _ =&gt; _);
}
</pre>

Yes, it's a little over-LINQ-ed, but I wanted to try to write it like this. :)

The convention itself needs to implement `IConfigurationConvention` interface with proper mix of two generic parameters. Let's name our columns and tables.

<pre class="brush:csharp">
class FirebirdNamingConvention :
	IConfigurationConvention&lt;PropertyInfo, PrimitivePropertyConfiguration&gt;,
	IConfigurationConvention&lt;Type, EntityTypeConfiguration&gt;
{
	public static string CreateName(string s)
	{
		return s.Aggregate(string.Empty, (acc, c) =&gt; acc + (char.IsUpper(c) &amp;&amp; !string.IsNullOrEmpty(acc) ? "_" + c : char.ToUpperInvariant(c).ToString()), _ =&gt; _);
	}

	public void Apply(PropertyInfo memberInfo, Func&lt;PrimitivePropertyConfiguration&gt; configuration)
	{
		var conf = configuration();
		conf.ColumnName = CreateName(memberInfo.Name);
	}

	public void Apply(Type memberInfo, Func&lt;EntityTypeConfiguration&gt; configuration)
	{
		var conf = configuration();
		conf.ToTable(CreateName(memberInfo.Name), null);
	}
}
</pre>

Simple, isn't it? Now we need to just register this convention.

<pre class="brush:csharp">
class FirebirdContext : DbContext
{
	public FirebirdContext()
		: base(new FbConnection(@"database=localhost:test;user=sysdba;password=masterkey"), true)
	{ }

	public IDbSet&lt;TestEntity&gt; TestEntities { get; set; }

	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		modelBuilder.Conventions.Add(new FirebirdNamingConvention());
		//modelBuilder.Properties().Configure(c =&gt; c.HasColumnName(FirebirdNamingConvention.CreateName(c.ClrPropertyInfo.Name)));
		//modelBuilder.Entities().Configure(c =&gt; c.ToTable(FirebirdNamingConvention.CreateName(c.ClrType.Name)));
	}
}
</pre>

I have also included other way to write the conventions, directly in `OnModelCreating` using so-called lightweight conventions.

Simple code to test.

<pre class="brush:csharp">
Database.SetInitializer&lt;FirebirdContext&gt;(null);
using (var ctx = new FirebirdContext())
{
	Console.WriteLine(ctx.TestEntities.Where(x =&gt; x.MyInteger == 0).ToString());
}
</pre>
<pre class="brush:csharp">
class TestEntity
{
	public int Id { get; set; }
	public string SomeBoringColumn { get; set; }
	public int MyInteger { get; set; }
	public DateTime DateTime { get; set; }
	public DateTime Timestamp { get; set; }
}
</pre>

And the result.

<pre class="brush:sql">
SELECT
"B"."ID" AS "ID",
"B"."SOME_BORING_COLUMN" AS "SOME_BORING_COLUMN",
"B"."MY_INTEGER" AS "MY_INTEGER",
"B"."DATE_TIME" AS "DATE_TIME",
"B"."TIMESTAMP" AS "TIMESTAMP"
FROM "TEST_ENTITY" AS "B"
WHERE 0 = "B"."MY_INTEGER"
</pre>

Few lines of code and could save you maybe hundreds of lines of code you'd have to write otherwise.

> Note: This code uses custom build FirebirdClient (with current stable one it will not work), because Entity Framework 6 contains some breaking changes for provider writers. I'm working on it and the test builds will be available soon.

[1]: {{ site.url }}{% post_url 2013-03-11-233174-custom-conventions-in-entity-framework-6-helping-firebird-part-2 %}
[2]: http://entityframework.codeplex.com/wikipage?title=Custom%20Conventions
[3]: http://www.firebirdsql.org
[4]: {{ site.url }}{% post_url 2014-11-11-233488-upper-casing-convention-as-sql-likes-it-in-entity-framework-6 %}