---
title: |-
  Casting Expression<Func<TEntity, TProperty>> to Expression<Func<TEntity, object>>
date: 2011-02-28T05:13:04Z
tags:
  - .NET
  - C#
layout: post
---
From time to time I'm dealing with API that's using Expression<Func<TEntity, object>> as parameter, mainly to show property you want to deal with. And that's fine, if you need just the expression itself. But I often create my custom extensions, where I'm somehow working with the property itself or the result. And that's a problem, because I don't know any info about the type, it's just object.

If you try to directly cast the expression, it will not work, of course. First I though, it's going to be a lot of juggle with pieces of expression and reconstructing the final one. But it's pretty easy, see yourself:

```csharp
void FooBar<TEntity, TProperty>(TEntity entity, Expression<Func<TEntity, TProperty>> property)
{
	Expression<Func<TEntity, object>> result;
	if (typeof(TProperty).IsValueType)
		result =  Expression.Lambda<Func<TEntity, object>>(Expression.Convert(property.Body, typeof(object)), property.Parameters);
	else
		result = Expression.Lambda<Func<TEntity, object>>(property.Body, property.Parameters);
	// do something with result ...
}
```

I'm simply creating new expression based on the original ones' body and parameters. If the `TProperty`'s type was value type I only do boxing in addition.

Nothing difficult, right?