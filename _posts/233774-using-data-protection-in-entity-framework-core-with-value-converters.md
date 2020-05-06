---
title: |-
  Using Data Protection in Entity Framework Core with Value Converters
date: 2019-04-02T18:44:00Z
tags:
  - Encryption
  - Entity Framework Core
  - Security
---
When I wrote the post [Using value converter for custom encryption of field on Entity Framework Core 2.1][1] the encryption there was non-existing. My intention was to show the skeleton. But in comments somebody asked how to wire up Data Protection.

<!-- excerpt -->

Data Protection is a nice feature in .NET Core, that abstracts the converter itself from inventing some half-broken encryption and hence it's a good idea to use it. The API is pretty straightforward, you get an `IDataProtectionProvider` and from that you construct `IDataProtector` which has `Protect` and `Unprotect` methods. Let's wire it up into the Entity Framework's converter.

```csharp
public class ProtectedConverter : ValueConverter<string, string>
{
	class Wrapper
	{
		readonly IDataProtector _dataProtector;

		public Wrapper(IDataProtectionProvider dataProtectionProvider)
		{
			_dataProtector = dataProtectionProvider.CreateProtector(nameof(ProtectedConverter));
		}

		public Expression<Func<string, string>> To => x => x != null ? _dataProtector.Protect(x) : null;
		public Expression<Func<string, string>> From => x => x != null ? _dataProtector.Unprotect(x) : null;
	}

	public ProtectedConverter(IDataProtectionProvider provider, ConverterMappingHints mappingHints = default)
		: this(new Wrapper(provider), mappingHints)
	{ }

	ProtectedConverter(Wrapper wrapper, ConverterMappingHints mappingHints)
		: base(wrapper.To, wrapper.From, mappingHints)
	{ }
}
```

Basically, the same structure as in the [previous post][1]. The only trick I had to do (although there's multiple ways to solve it) is the `Wrapper` class, which serves as a glue layer to get the expressions into the `base` constructor.

With that, I can use it in `DbContext`.

```csharp
class FooBar
{
	public int Id { get; set; }
	[Protected]
	public string Secret { get; set; }
}

[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
sealed class ProtectedAttribute : Attribute
{ }

class MyContext : DbContext
{
	readonly IDataProtectionProvider _dataProtectionProvider;

	public MyContext(IDataProtectionProvider dataProtectionProvider)
	{
		_dataProtectionProvider = dataProtectionProvider;
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<FooBar>()
			.Property(x => x.Secret).HasMaxLength(500);

		foreach (var entityType in modelBuilder.Model.GetEntityTypes())
		{
			foreach (var property in entityType.GetProperties())
			{
				var attributes = property.PropertyInfo.GetCustomAttributes(typeof(ProtectedAttribute), false);
				if (attributes.Any())
				{
					property.SetValueConverter(new ProtectedConverter(_dataProtectionProvider));
				}
			}
		}
	}
}
```

And finally, some basic code to test it.

```csharp
var serviceCollection = new ServiceCollection();
serviceCollection.AddDataProtection();
serviceCollection.AddDbContext<MyContext>();
var services = serviceCollection.BuildServiceProvider();

using (var ctx = ActivatorUtilities.CreateInstance<MyContext>(services))
{
	ctx.Set<FooBar>().Add(new FooBar()
	{
		Secret = "Jiri"
	});
	ctx.SaveChanges();
}
```

That's it. Hope it helps.

[1]: {{ include "post_link" 233708 }} 