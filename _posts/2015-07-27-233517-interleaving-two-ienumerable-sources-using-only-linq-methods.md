---
title: "Interleaving two IEnumerable sources using only LINQ methods"
date: 2015-07-27T17:59:00Z
tags:
  - .NET
  - C#
  - LINQ
redirect_from: /id/233517/
category: none
layout: post
---
I was cleaning up some old posts and converting them to Markdown on this blog and I came across [this post][1]. Although it's still valid and works fine I've got an idea. Is it possible to write it using only LINQ methods? Thus not being imperative? You might be wondering: "Why?". But I just like these small brain teasers. :) 

<!-- excerpt -->

OK, back to business. Of course it's possible and it's not even crazy ugly construct.

```csharp
internal static IEnumerable<T> Interleave<T>(this IEnumerable<T> first, IEnumerable<T> second)
{
	return first.Zip(second, (a, b) => new[] { a, b }).SelectMany(x => x);
}
```

Of course there's a small difference how this method handles `IEnumerable`s with different length compared to the other. But frankly I don't know what's the "correct" behavior (should it be allowed, for example?). Both - the old one and the new one - seem to be fine. Heck there's even a third option. I'll leave that for others. There's not enough small brain teasers. :)      

[1]: {{ site.address }}{% post_url 2010-10-05-232039-interleaving-two-ienumerable-sources %}
