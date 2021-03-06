---
title: |-
  Collection type result - speed comparison of IList.Add and IEnumerable.Concat
date: 2011-08-29T16:56:21Z
tags:
  - .NET
  - C#
---
From time to time I'm working on some method that returns some collection. Mainly processing some data from input. Often it's really just couple of conditions, get something from there and here and return it. Because I'm composing these methods too, if I return [IEnumerable<T>][1] and later in other method I need to add something (if you're lost, you'll see what I mean in example below), I need to use some variable, like array or list and append (or prepend). Boring.

For a while I was wondering, how slow it will be, if I'll be simply creating new IEnumerable sequences and concatenating these. I was expecting it to be slower, but is it only couple of percents or order of magnitude? Today, when I came to my office, I simply decided to test it.

The first version looks like

```csharp
static IEnumerable<int> Test1(int[] part1, int[] part2, int[] part3)
{
	IEnumerable<int> result = Enumerable.Empty<int>();
	result = result.Concat(part1);
	result = result.Concat(part2);
	result = result.Concat(part3);
	return result;
}
```

And the other one

```csharp
static IEnumerable<int> Test2(int[] part1, int[] part2, int[] part3)
{
	IList<int> result = new List<int>();
	foreach (var item in part1)
		result.Add(item);
	foreach (var item in part2)
		result.Add(item);
	foreach (var item in part3)
		result.Add(item);
	return result;
}
```

Although it, especially the other one, can be written in different way(s), as a measure I think it's OK. And it's close to how I often process the data.

I did couple of runs to eliminate some errors, with "Release" build, without attached debugger. The `part1` and `part3` parameters were always the same in size. The `part2` I was playing with, because the size affects the speed too.

If the `part2` size was roughly under 10k items, the speed difference was on the edge error of measurement. From 10k+ to 1M items it's about 25% the `Concat` approach being slower. Some absolute numbers (averages from 20 runs, "Release" build, without attached debugger) from my laptop:

```text
Size: 1         Time1: 0        Time2: 0        %: 0
Size: 2         Time1: 0        Time2: 0        %: 0
Size: 3         Time1: 0        Time2: 0        %: 0
Size: 4         Time1: 0        Time2: 0        %: 0
Size: 5         Time1: 0        Time2: 0        %: 0
Size: 6         Time1: 0        Time2: 0        %: 0
Size: 10        Time1: 0        Time2: 0        %: 0
Size: 100       Time1: 0        Time2: 0        %: 0
Size: 1000      Time1: 0        Time2: 0        %: 0
Size: 6000      Time1: 0,2      Time2: 0        %: 0
Size: 20000     Time1: 2,05     Time2: 0,5      %: 24,390243902439
Size: 60000     Time1: 6,55     Time2: 1,6      %: 23,3576642335766
Size: 100000    Time1: 11,8     Time2: 3,15     %: 24,7899159663866
Size: 1000000   Time1: 124,85   Time2: 33,2     %: 26,9609775325187
```

Conclusion? If the data is relatively small, the path you choose doesn't really matter. For "bigger" collections the imperative approach provides better performance.

[1]: http://msdn.microsoft.com/en-us/library/9eekhta0.aspx