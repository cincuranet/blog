---
title: |-
  Mapping private/protected/... properties in Entity Framework 4.x Code First
date: 2012-02-17T13:07:34Z
tags:
  - Entity Framework
---
More than a year ago I was blogging about [how to map private/protected/... properties in Code First CTP4][1] for the time being. Well it has been a long time and a lot of changed. The code there isn't absolutely up to date with current [Entity Framework 4.3][2].

Although you can go raw and create the expression tree from i.e. string yourself ([Mono.Linq.Expressions][3] can be quite handy) it's not nice and more importantly it's not strongly typed. If you don't want to use data annotations or couple your configuration classes into entity classes you're still not lost. In the above linked post [in comments _Drew Jones_][4] came with a nice idea.

You entity classes will be partial classes and somewhere else you'll create second part of that class with the expressions needed to express the properties. Let's take a look at example (you can adjust access modifiers according to your needs and structure).

```csharp
public partial class FooBar
{
	private int ID { get; set; }
	private string Something { get; set; }
}
public partial class FooBar
{
	public class PropertyAccessExpressions
	{
		public static readonly Expression<Func<FooBar, int>> ID = x => x.ID;
		public static readonly Expression<Func<FooBar, string>> Something = x => x.Something;
	}
}
```

And now in mapping you'll just use the expressions.

```csharp
	.Property(FooBar.PropertyAccessExpressions.ID);
	.Property(FooBar.PropertyAccessExpressions.Something);
```

Nice isn't it? It's separated (kind of - you can't have entity classes in one assembly and the expressions in other) and it's strongly typed.

[1]: {% include post_link id="232147" %}
[2]: http://blogs.msdn.com/b/adonet/archive/2012/02/09/ef-4-3-released.aspx
[3]: http://nuget.org/packages/Mono.Linq.Expressions
[4]: {% include post_link id="232147" %}#comments