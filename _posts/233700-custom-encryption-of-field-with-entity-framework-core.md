---
title: |-
  Custom encryption of field with Entity Framework Core
date: 2018-02-05T10:14:00Z
tags:
  - Encryption
  - Entity Framework Core
  - Security
---
Almost exactly 5 years ago (yes, that's 2013) I wrote about [Custom encryption of field with Entity Framework][1]. At that time, it was using few tricks to make it work and although it might have looked like magic first time you saw it, it was actually very easy. With Entity Framework Core nowadays we have far more options how the entity can look like and hence how the whole solution can be plugged together. Let's revisit the topic.

<!-- excerpt -->

Because Entity Framework Core supports accessing not only properties for getting/setting data, but also backing fields (with various options), it's easier to do this. The idea it that Entity Framework Core will only operate on fields and data in these will be encrypted, and the application will use only properties, as usual. To make it work from Entity Framework Core's side, I'll simple use the `UsePropertyAccessMode` (or rather `SetPropertyAccessMode` as I'll create kind of convention for it) and `HasField`/`SetField`.

Let's start with the entity.

```csharp
class FooBar
{
	string _secret;

	public int Id { get; set; }

	[Encrypted(nameof(_secret))]
	public string Secret
	{
		get => Decrypt(_secret);
		set => _secret = Encrypt(value);
	}

	static string Decrypt(string s) => new string(s.Reverse().ToArray());

	static string Encrypt(string s) => new string(s.Reverse().ToArray());
}
```

Nothing special, except for the `Encrypted` attribute on the `Secret` property, which I'll explain in a moment, and the `Encrypt`/`Decrypt` methods (as in the [original post][1], these methods are dummy ones; don't do that in real code) used in the getter/setter of the property.

The `Encrypted` attribute is a marker for my convention to trigger the logic explained above and also to hold the name of the backing field (convention can be used for that as well).

```csharp
[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
sealed class EncryptedAttribute : Attribute
{
	readonly string _fieldName;

	public EncryptedAttribute(string fieldName)
	{
		_fieldName = fieldName;
	}

	public string FieldName => _fieldName;
}
```

And finally the `DbContext`.

```csharp
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
					property.SetField((attributes.First() as EncryptedAttribute).FieldName);
					property.SetPropertyAccessMode(PropertyAccessMode.Field);
				}
			}
		}
	}
}
```

The important piece is in `OnModelCreating` where I go over all properties in all entities and if `Encrypted` attribute is present I configure the property using the `SetField` and [`SetPropertyAccessMode`][2]. I use the [`PropertyAccessMode.Field`][3], which means whenever Entity Framework Core gets or sets a value, it will do it on the field directly, not through property.

To test it, I used a very simple piece of code. Regular Entity Framework Core usage with bit of plain ADO.NET to get raw values from database and check the values are properly stored.

```csharp
using (var db = new MyContext())
{
	db.Database.EnsureCreated();
	db.Add(new FooBar() { Secret = "Hello world!" });
	db.SaveChanges();
}
using (var db = new MyContext())
{
	foreach (var item in db.Set<FooBar>())
	{
		Console.WriteLine($"Id: {item.Id} | Secret: {item.Secret}");
	}
	using (var cmd = db.Database.GetDbConnection().CreateCommand())
	{
		db.Database.OpenConnection();
		cmd.CommandText = "select * from foobar";
		using (var reader = cmd.ExecuteReader())
		{
			while (reader.Read())
			{
				var values = new object[reader.FieldCount];
				reader.GetValues(values);
				Console.WriteLine(string.Join(";", values));
			}
		}
	}
	db.Database.EnsureDeleted();
}
```

Which outputs.

```text
Id: 1 | Secret: Hello world!
1;!dlrow olleH
```

Although I was fine with the way I did it in Entity Framework, I have to say, in Entity Framework Core it's nicer and feels very integrated without any special code.

> [Another approach using value converters in Entity Framework Core 2.1.][4]

[1]: {{ include "post_link" 233147 }}
[2]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.mutablepropertybaseextensions.setpropertyaccessmode?view=efcore-2.0
[3]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.propertyaccessmode?view=efcore-2.0
[4]: {{ include "post_link" 233708 }}