---
title: |-
  Enumerating over Select's index
date: 2024-02-15T09:24:00Z
tags:
  - C#
  - .NET
---
My mind was wandering, as usual when it is not 100% occupied, and I remembered that the [`Select` LINQ function has an overload][1] that gives you the index into the enumeration and it uses an int. So, I thought what's going to happen if I have longer enumeration and it goes over the range of the int?

<!-- excerpt -->

Most of the time it's probably fine because most of the collections and arrays and ... are limited by having `Count`/`Length` as an int. But obviously you can create an enumeration that's using the yield return keywords and basically keep iterating over the range of an int. So, I did that and this is the result.

```csharp
static class Program
{
    static void Main()
    {
        foreach (var i in ALotOfStrings().Select((s, i) => i))
        { }
    }

    static IEnumerable<string> ALotOfStrings()
    {
        for (var j = 0L; j < long.MaxValue; j++)
        {
            yield return string.Empty;
        }
    }
}
```

Running this gives an uninspiring exception `System.OverflowException: Arithmetic operation resulted in an overflow.`. On the other it makes sense what else should happen (except for rolling over), right?

Hmm, how is it actually implemented? Is there some magic or is it a simple iteration that increments a counter? Well, let's [see][2].

```csharp
private static IEnumerable<TResult> SelectIterator<TSource, TResult>(IEnumerable<TSource> source, Func<TSource, int, TResult> selector)
{
    int index = -1;
    foreach (TSource element in source)
    {
        checked
        {
            index++;
        }

        yield return selector(element, index);
    }
}
```

Oh my, all this exploration is getting more and more boring. Time to get back to work.

[1]: https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.select?view=net-8.0#system-linq-enumerable-select-2(system-collections-generic-ienumerable((-0))-system-func((-0-system-int32-1)))
[2]: https://source.dot.net/#System.Linq/System/Linq/Select.cs,89