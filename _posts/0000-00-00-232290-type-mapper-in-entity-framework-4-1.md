---
title: |-
  Type mapper in Entity Framework 4.1
date: 2011-03-22T18:03:36Z
tags:
  - Entity Framework
layout: post
---
Even if you [remove all conventions][1] when using [Code First][2] you might get errors from Entity Framework about not being able to properly map some items. The reason is _type mapper_. In RC (and very probably in RTM as well) it's not implemented as convention, hence always kicks in.

In this case the `Ignore` method comes into play. For instance I have in my code property:

```csharp
public CultureInfo Locale
{
	get { ... }
	set { ... }
}
```

and I'm not mapping it at any place. But Entity Framework will still complain about pieces of `CultureInfo` not being properly mapped. But in `EntityTypeConfiguration` can make Entity Framework to ignore it. For example:

```csharp
class FooBarConfiguration : EntityTypeConfiguration<FooBar>
{
	public FooBarConfiguration()
	{
		// ...
		this.Ignore(x => x.Locale);
		this.Map(...);
	}
}
```

At first I was confused, but after quick email exchange with EF team the "issue" was clear.

[1]: {% include post_id_link id="232283" %}
[2]: http://msdn.microsoft.com/en-us/magazine/gg232765.aspx