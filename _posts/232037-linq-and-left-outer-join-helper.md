---
title: |-
  LINQ and left outer join helper
date: 2010-10-05T09:55:38Z
tags:
  - .NET
  - C#
  - LINQ
---
Previous two functions ([function 1][1], [function 2][2]) I presented were doing something that wasn't core part of [LINQ][3] and it was up to you to create it. On the other hand, this function is different. It's just a helper to simplify writing of [left outer join][4] (or right outer join, depending on what collection you consider to be on left/right side). Not because it's hard to write it, but because it involves couple of lines and repeating it all the time is just boring. 8-)

```csharp
internal static IEnumerable<TResult> LeftOuterJoin<TOuter, TLeft, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TLeft> left, Func<TOuter, TKey> outerKeySelector, Func<TLeft, TKey> leftKeySelector, Func<TOuter, TLeft, TResult> resultSelector)
{
	return
		from o in outer
		join r in left on outerKeySelector(o) equals leftKeySelector(r) into j
		from r in j.DefaultIfEmpty()
		select resultSelector(o, r);
}
```

Nothing tricky. You can find this in many examples, I just wrapped it into method and parametrized it a little. Enjoy.

[1]: {{ include "post_link" 232039 }}
[2]: {{ include "post_link" 232041 }}
[3]: http://en.wikipedia.org/wiki/Language_Integrated_Query
[4]: http://en.wikipedia.org/wiki/Join_(SQL)#Left_outer_join