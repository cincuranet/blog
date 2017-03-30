---
title: |-
  Aggregating with increments
date: 2010-10-05T09:54:56Z
tags:
  - .NET
  - C#
  - LINQ
layout: post
---
Similarly to [previous method for Interleaving two IEnumerables][1] I needed one method for doing kind of aggregate, but also to know about the intermediate steps. I could abuse the [Aggregate][2] method either directly or indirectly but I'm always more happy with clean solution.

The method is pretty simple (but before I did some rework, it was ugly ;)). It takes, apart from the [IEnumerable][3], two functions. One for setting up the initial value for the first item and one for getting result for next step.

```csharp
internal static IEnumerable<TResult> IncrementalAggregate<TSource, TResult>(this IEnumerable<TSource> data,
	Func<TSource, TResult> init,
	Func<TSource, TResult, TResult> nextResult)
{
	bool first = true;
	TResult intermediate = default(TResult);
	foreach (var item in data)
	{
		if (first)
		{
			intermediate = init(item);
			first = false;
		}
		else
		{
			intermediate = nextResult(item, intermediate);
		}
		yield return intermediate;
	}
}
```

With it you can do i.e. summing the numbers and know what the intermediate sums were. Yes, sounds weird, but you might need it, one day as I did. :)

[1]: {% post_url 2010-10-05-232039-interleaving-two-ienumerable-sources %}
[2]: http://msdn.microsoft.com/en-us/library/system.linq.enumerable.aggregate.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.collections.ienumerable.aspx