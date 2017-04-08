---
title: |-
  Coalescing object and accessing it
date: 2011-07-09T17:13:29Z
tags:
  - .NET
  - C#
layout: post
---
I was reading Twitter yesterday and spotted a [tweet][1] from [Shawn Wildermuth][2] about his pain about using [coalesce operator (`??`) in C#][3] and doing immediately something with result.

I had same problem maybe a year back, when I was dealing heavily with [XML][4] and [LINQ to XML][5] (but it doesn't matter). I created for myself a little extension method to help me solve writing lines like:

```csharp
Something x = (a == null ? "FooBar" : a.FooBar);
```

The method:

```csharp
public static TResult ObjectCoalesce<T, TResult>(this T o, Func<T, TResult> operation, TResult @default)
	where T : class
{
	if (o == null)
		return @default;
	else
		return operation(o);
}
```

And simple usage:

```csharp
Something x = a.ObjectCoalesce(y => y.FooBar, "FooBar");
```

When it's nested in some calls, it really helped me to make my code shorter. You can also play (I did) with idea of having the _default_ parameter as delegate so it will be evaluated only if needed. In some cases it could make a huge difference (i.e. side-effects).

[1]: http://twitter.com/#!/ShawnWildermuth/status/89422296879603713
[2]: http://wildermuth.com/
[3]: http://msdn.microsoft.com/en-us/library/ms173224.aspx
[4]: http://www.w3.org/XML/
[5]: http://msdn.microsoft.com/en-us/library/bb387098.aspx