---
title: |-
  Improving list sum function based on head and tail with C# 8
date: 2020-03-03T14:06:00Z
tags:
  - C#
  - Functional programming
---
Some time back I wrote about [Head- and Tail-like methods in C# (and F# and Python and Haskell)][1]. For some strange reasons I came across the `Sum` method I wrote there and I thought maybe I can rewrite it with _switch expression_ now available in C# and have a nicer looking code. I mean I'm a big fan of succinct (yet still readable) code. But I had no idea what a journey it will be.

<!-- excerpt -->

Let me start by putting the `Sum` method here so we have it in from of our eyes.

```csharp
int Sum(List<int> list)
{
	switch (list.Count)
	{
		case 0:
			return 0;
		default:
			var (head, tail) = list;
			return head + Sum(tail);
	}
}
```

Fairly simple, right? Shouldn't be difficult to rewrite it using the _switch expression_. Err. The `default` clause contains a block and not an expression. Something like this is not going to go through the C# compiler.

```csharp
int Sum(List<int> list) => list.Count switch
{
	0 => 0,
	_ =>
	{
		var (head, tail) = list;
		return head + Sum(tail);
	},
};
```

I can probably use local functions and work around it.

```csharp
int Sum(List<int> list)
{
	static int SumImpl(List<int> list)
	{
		var (head, tail) = list;
		return head + Sum(tail);
	}
	return list.Count switch
	{
		0 => 0,
		_ => SumImpl(list),
	};
}
```

And although this works, I don't think I made the code nicer or succinct at all. In fact, I think it's tangled compared to the original version. The problem is the tuple deconstruction and the fact that I can't put it into expression (Maybe you can?).

Something like the following would be nice, but again I don't think it's helping the code and I'm just trying to free myself on top of previous limitations.

```csharp
int Sum(List<int> list)
{
	static int SumImpl(List<int> list) => SumSum(((head, tail) = list));
	static int SumSum((int head, List<int> tail) item) => item.head + Sum(item.tail);
	return list.Count switch
	{
		0 => 0,
		_ => SumImpl(list),
	};
}
```

It's time to think outside the box. And then it hit me. I can probably go one step higher and work from there. Because then I can use [_`var` declarations_][2] in the cases.

```csharp
int Sum(List<int> list) => list switch
{
	var l when l.Count == 0 => 0,
	var (head, tail) => head + Sum(tail),
};
```

Not sure if it's more readable, but it's succinct. _Expression body_, check; _switch expression_ check. The only problem I have is the first clause. It's kind of weird, isn't it? I can probably improve it by not introducing a new variable.

```csharp
int Sum(List<int> list) => list switch
{
	var _ when list.Count == 0 => 0,
	var (head, tail) => head + Sum(tail),
};
```

That's slightly better. But still, meh.

And then I saw it! The [_property pattern_][3] is going to help me be more declarative.

```csharp
int Sum(List<int> list) => list switch
{
	{ Count: 0 } => 0,
	var (head, tail) => head + Sum(tail),
};
```

I am happy with it. I think this is as good as it gets right now. Or is it?

[1]: {% include post_link, id: "233633" %}
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/pattern-matching#var-declarations-in-case-expressions
[3]: https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8#property-patterns