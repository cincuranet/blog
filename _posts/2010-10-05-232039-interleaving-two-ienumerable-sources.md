---
title: |
  Interleaving two IEnumerable sources
date: 2010-10-05T09:53:23Z
tags:
  - .NET
  - C#
  - LINQ
layout: post
---
> [Follow-up post.][1]

I was recently doing some work related to custom reporting and I needed to simply interleave two streams of data (it was actually same source, but different items selected). Kind of select first item from the first stream, first from the other, second from first, second from other etc. No big deal.

To make this easily doable I created simple extension method for me.

```csharp
internal static IEnumerable<T> Interleave<T>(this IEnumerable<T> first, IEnumerable<T> second)
{
	using (IEnumerator<T>
		enumerator1 = first.GetEnumerator(),
		enumerator2 = second.GetEnumerator())
	{
		while (enumerator1.MoveNext())
		{
			yield return enumerator1.Current;
			if (enumerator2.MoveNext())
				yield return enumerator2.Current;
		}
	}
}
```

It keeps reading elements from the first stream and if there's enough in the second stream then interleave. If the second one isn't "long" enough, it'll keep returning only items from first one. If the second one is "longer", it'll stop when the first one is empty. If you need handle these cases differently, you can either change the method or preprocess the streams before using this method.

[1]: {% post_url 2015-07-27-233517-interleaving-two-ienumerable-sources-using-only-linq-methods %}