---
title: |-
  Prepend method in LINQ
date: 2010-06-29T07:07:29Z
tags:
  - .NET
  - C#
  - LINQ
---
[Yesterday I needed][1] to put one element at beginning of the collection I already had. Some kind of [Concat][2] upside down. :) As you can use the Concat method, it looks weird when you see the code, because two items are actually swapped. So I created a simple extension method to do it for me.

I started with:

```csharp
public static IEnumerable<T> Prepend<T>(this IEnumerable<T> source, T item)
{
	yield return item;
	foreach (var x in source)
		yield return x;
}
```

It's classic [imperative][3] approach, you're expressing how you'll do it. Then I thought: "Hey, why not to use LINQ methods already available.". As you guess, I abused Concat method as I wrote above:

```csharp
public static IEnumerable<T> Prepend<T>(this IEnumerable<T> source, T item)
{
	return new[] { item }.Concat(source);
}
```

You can easily extend both methods to accept also collection as a second parameter.

If you're more about [declarative][4] programming you'll probably like the other one. But choose whatever fits your brain better.

[1]: http://twitter.com/cincura_net/status/17243088115
[2]: http://msdn.microsoft.com/en-us/library/bb302894.aspx
[3]: http://en.wikipedia.org/wiki/Imperative_programming
[4]: http://en.wikipedia.org/wiki/Declarative_programming