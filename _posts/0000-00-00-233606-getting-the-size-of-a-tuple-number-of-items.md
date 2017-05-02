---
title: |-
  Getting the size of a tuple (number of items)
date: 2017-03-28T15:46:00Z
tags:
  - .NET
  - C#
layout: post
---
[Yesterday was a trip to the world of tuples and reflection][1] and today I'm going to continue on that note. [As previously][2], I needed something with tuples for [FbNetExternalEngine][3] - number of elements in whole tuple. I call it "size of tuple". 

<!-- excerpt -->

The idea isn't difficult at all. In fact, I consider it pretty good example for recursion. First, I assume the tuple is "the tuple" in a sense from [yesterday's code][1]. Then it's just checking number of generic parameters, if it's 8, then taking the last one and repeating the process.

```csharp
public static int GetSize(Type tuple)
{
	var genericArguments = tuple.GetGenericArguments();
	if (genericArguments.Length > 7)
	{
		return 7 + GetSize(genericArguments[7]);
	}
	else
	{
		return genericArguments.Length;
	}
}
```

And some tests to sleep better.

```csharp
[TestCase(typeof((int, int)), ExpectedResult = 2)]
[TestCase(typeof((int, int, string, string, int, int, string, string, int, int)), ExpectedResult = 10)]
[TestCase(typeof(ValueTuple<int>), ExpectedResult = 1)]
[TestCase(typeof(ValueTuple<int, ValueTuple<int, int>>), ExpectedResult = 2)]
public int GetSizeTest(Type tuple)
{
	return TupleHelper.GetSize(tuple);
}
```

I opted for slightly longer code but more readable code, instead of having it on just two lines.  

[1]: {% include post_link id="233605" %}
[2]: {% include post_link id="233601" %}
[3]: {% include post_link id="233566" %}