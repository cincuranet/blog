---
title: |-
  Tuples goodness in .NET 4.7.1 (.NET Core 2.0 included)
date: 2018-01-24T09:57:00Z
tags:
  - .NET
  - .NET Core
  - .NET Standard
  - C#
---

One of the few things I was missing when tuples were introduced was some way to generically work with unknown tuples. Mostly to be able to identify tuples, instead of using plain `object` and also work with items using index of some sort. Luckily, I was probably not the only one and starting .NET 4.7.1 new interesting interface - [`ITuple`][1] - was added (also available in .NET Core 2.0).

<!-- excerpt -->

This interface, first and foremost, allows you to accept any tuple without using `object` as a type and doing some reflection magic. Every tuple implements this interface (explicitly) so you don't have to do anything to use it.

Second nice thing, my favorite, is the indexer `Item[Int32]`. With it you can easily access tuple elements, again without reflection or [other magic][2].

And finally, you can get the size or tuple using `Length` property. Again, saves a [lot of reflection code][3].

Putting it all together in a nice, clean, readable code.

```csharp
static void Main(string[] args)
{
	var data = (10, "ten", 4.6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
	FooBar(data);
}

static void FooBar(ITuple tuple)
{
	Console.WriteLine($"# of elements: {tuple.Length}");
	Console.WriteLine($"Second to last element: {tuple[tuple.Length - 2]}");
}
```

Sadly, at the moment, the `ITuple` is not part of .NET Standard 2.0.

[1]: https://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.ituple%28v=vs.110%29.aspx
[2]: {% include post_link, id: "233601" %}
[3]: {% include post_link, id: "233606" %}
