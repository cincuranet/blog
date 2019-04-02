---
title: |-
  Using value converter for custom encryption of field on Entity Framework Core 2.1
date: 2018-03-20T16:55:00Z
tags:
  - Encryption
  - Entity Framework Core
  - Security
---
In February I wrote [Custom encryption of field with Entity Framework Core][2] post, which in turn was building on [idea][3] for Entity Framework 6. Both are easy, but not absolutely straightforward. And another problem is that the encrypted value needs to fit into the datatype of unencrypted value. Finally, the querying is inconvenient. Luckily Entity Framework Core 2.1 (currently in preview) has a solution.

<!-- excerpt -->

#### Introduction

The feature that makes all this happen is called [_Value Conversions_][1]. Simply speaking whenever the value is read or written your function is called and can do whatever transformation it wants. The wiring happens in `HasConversion` method in `OnModelCreating`. Alternatively, an instance of `ValueConverter` can be created and the whole logic is encapsulated there. The examples in above linked documentation show the basics.

#### Code

I'll use the same entity as [in previous post][2] and the same attribute (because I want it reusable). The whole code will look like this then.

```csharp
class FooBar
{
	public int Id { get; set; }
	[Encrypted]
	public string Secret { get; set; }
}

[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
sealed class EncryptedAttribute : Attribute
{ }

class MyContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		base.OnConfiguring(optionsBuilder);

		optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Integrated Security=true;database=test");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<FooBar>()
			.Property(x => x.Secret).HasMaxLength(20);

		foreach (var entityType in modelBuilder.Model.GetEntityTypes())
		{
			foreach (var property in entityType.GetProperties())
			{
				var attributes = property.PropertyInfo.GetCustomAttributes(typeof(EncryptedAttribute), false);
				if (attributes.Any())
				{
					property.SetValueConverter(new EncryptedConverter());
				}
			}
		}
	}
}

class EncryptedConverter : ValueConverter<string, string>
{
	public EncryptedConverter(ConverterMappingHints mappingHints = default)
		: base(EncryptExpr, DecryptExpr, mappingHints)
	{ }

	static Expression<Func<string, string>> DecryptExpr = x => new string(x.Reverse().ToArray());
	static Expression<Func<string, string>> EncryptExpr = x => new string(x.Reverse().ToArray());
}
```

The important stuff happens in `OnModelCreating` where I iterate over all properties of all entities and the ones with `Encrypted` attribute have `EncryptedConverter` registered (which has the same "encryption logic" as previously).

Writing the converter itself is pretty straightforward. You need to provide two expressions. One that will transform the value from entity's value to a database value and the other that does the opposite.

You can use the same test code [from previous post][2] to see it does what's expected. What I'm going to instead here is explore the querying options.

#### Querying

Previously, because all the transformations were done without Entity Framework Core's notice in the entity itself, you had to do all the transformations in query parameters yourself. Not anymore. Entity Framework Core handles that for you transparently now. Well, at least the transformation part. Not the logical part. Let me explain. 

Imagine you want to query all the entities ending with `world!` (beucase my code saved `Hello world!` in `Secret`). Then you simply write `db.Set<FooBar>().Where(x => x.Secret.EndsWith("world!"))`. And Entity Framework Core will translate that for you correctly.

```sql
SELECT [x].[Id], [x].[Secret]
FROM [FooBar] AS [x]
WHERE RIGHT([x].[Secret], LEN(N'world!')) = N'!dlrow' 
```

The value that's used for comparison, `!dlrow`, is correct. Not the operations. Given the logic in the converter you actually have to use `StartsWith` in this case. However you and only you understand the logic in the converter and you haveto do the appropriate adjustments.

Note: You can also notice that the `LEN` call is not correct and the value there should be converted as well ([more info][4]). 

#### Summary

Although I was pretty happy with the previous version, using the converter is cleaner and more readable. And I think converters will allow for a lot of new possibilities, especially for non-common datatypes either on database- or on code-side.

> [Follow-up post.][5]

[1]: https://docs.microsoft.com/en-us/ef/core/modeling/value-conversions
[2]: {% include post_link, id: "233700" %}
[3]: {% include post_link, id: "233147" %}
[4]: https://github.com/aspnet/EntityFrameworkCore/issues/11347
[5]: {% include post_link, id: "233774" %}