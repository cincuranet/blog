---
title: |-
  Upper-casing conventions as SQL likes it in Entity Framework 6
date: 2014-11-11T05:57:00Z
tags:
  - Entity Framework
---
Before Entity Framework 6 was finalized I wrote posts ([here][1] and [here][2]) showing how with the help of conventions you can save yourself some tedious typing for databases following strictly SQL standard in respect to upper case and (not)quoting (see previous posts for details).

But that was pre-EF6 era and some API changed. In fact it's now even way easier to do that.

<!-- excerpt -->

Let's do just simple "upper-casing" convention. Given I need to handle all columns and tables, even the ones generated, I need to use so-called store model conventions. These operate on the model in S-Space. The interface I'm going to use is [`IStoreModelConvention`][3]. This interface needs type parameter to describe on what element we're going to operate. I'll start with [`EdmProperty`][4]. This class represents column in S-Space. (Also I believe there's a way from [`EntityType`][5]. But why to make it harder.) Whoever implements `IStoreModelConvention` interface must implement single method `void Apply(T item, DbModel model)`. No problem.

```csharp
public void Apply(EdmProperty item, DbModel model)
{
	item.Name = MakeUpperCase(item.Name);
}
```  

For tables I need to dig into [`EntitySet`][6] type aka `IStoreModelConvention<EntitySet>`. Not a problem either.

```csharp
public void Apply(EntitySet item, DbModel model)
{
	item.Table = MakeUpperCase(item.Table);
}
```

And that's it. Either I can make it as two conventions or single one. I feel that this is single logical package so I made it one.

```csharp
public class UpperCaseConvention : IStoreModelConvention<EntitySet>, IStoreModelConvention<EdmProperty>
{
	public void Apply(EntitySet item, DbModel model)
	{
		item.Table = MakeUpperCase(item.Table);
	}

	public void Apply(EdmProperty item, DbModel model)
	{
		item.Name = MakeUpperCase(item.Name);
	}

	protected virtual string MakeUpperCase(string s)
	{
		return s.ToUpperInvariant();
	}
}
```

I also made `MakeUpperCase` method virtual in case somebody would like to make slightly different implementation, simple subclassing it is.

With this it shouldn't take long to create bunch of custom conventions (and combine these) to match naming conventions - like `T_<tablename>`, `F_<columnname>` or `PropertyName` -> `PROPERTY_NAME`.  

[1]: {% include post_link, id: "233167" %}
[2]: {% include post_link, id: "233174" %}
[3]: http://msdn.microsoft.com/en-us/library/dn338062(v=vs.113).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.metadata.edm.edmproperty(v=vs.113).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.metadata.edm.entitytype(v=vs.113).aspx
[6]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.metadata.edm.entityset(v=vs.113).aspx