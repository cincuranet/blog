---
title: "Composing functions the LINQ way"
date: 2011-12-24T07:55:18Z
tags:
  - .NET
  - C#
  - Functional programming
  - LINQ
redirect_from: /id/232625/
category: none
layout: post
---
Few days ago I was writing a class, that was simply wrapped for a collection of other classes (with same interface), aggregate class. The class also had few methods, where the logic was simple. Let's say one method `M`. Other classes having same method as well. This method was simple transformation of data with same output as input. The aggregate class was simply calling `M` method of first, second, ... of other classes.

I started with something like this:

```csharp
function T M<T>(T data)
{
	T tmp = data;
	foreach (var c in classes)
	{
		tmp = c.M(tmp);
	}
	return tmp;
}
```

But then I had some weird wave in my brain and started thinking. I could create collection of functions, like `IEnumerable<Func<T, T>>` and call methods from this collection. Wait a minute... I can create from this collection of function one aggregate function and call just this one. Crazy? ;) Probably. But it's a nice way to keep my brain running.

It turned out, it's pretty easy with LINQ:

```csharp
public static Func<T, T> Compose<T>(this IEnumerable<Func<T, T>> source)
{
	return source.Aggregate((agg, fn) => (d => fn(agg(d))));
}
```

I don't think it's any more (less) useful than the `foreach` with direct method calls, but it's more succinct, more functional and more fun. 8-)