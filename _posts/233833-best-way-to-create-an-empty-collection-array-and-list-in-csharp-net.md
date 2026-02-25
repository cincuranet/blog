---
title: |-
  Best way to create an empty collection (array and list) in C# (.NET)
date: 2020-08-04T10:31:00Z
tags:
  - C#
  - .NET
  - .NET Core
---

I one of APIs I was working a while back I needed to return an empty collection. It was not a performance critical code, yet I decided what would be the best way to do it. Exploring and learning.

<!-- excerpt -->

The signature required me to return `List<T>`, but I started with testing arrays first. I expected [`Array.Empty`][1] to be clear winner, but I was also interested how other "common" ways stack up.

#### Array

I used `new TestArray[0]` (_Ctor_), `new TestArray[] { }` (_CtorInit_), `Array.Empty<TestArray>()` (_ArrayEmpty_) and `Enumerable.Empty<TestArray>().ToArray()` (_EnumerableEmpty_).

|          Method |      Mean |     Error |    StdDev | Ratio | RatioSD |  Gen 0 | Gen 1 | Gen 2 | Allocated |
|---------------- |----------:|----------:|----------:|------:|--------:|-------:|------:|------:|----------:|
|            Ctor | 3.3639 ns | 0.0647 ns | 0.0605 ns | 1.000 |    0.00 | 0.0076 |     - |     - |      24 B |
|        CtorInit | 3.0780 ns | 0.0634 ns | 0.0593 ns | 0.915 |    0.03 | 0.0077 |     - |     - |      24 B |
|      ArrayEmpty | 0.0000 ns | 0.0000 ns | 0.0000 ns | 0.000 |    0.00 |      - |     - |     - |         - |
| EnumerableEmpty | 8.2498 ns | 0.0616 ns | 0.0546 ns | 2.450 |    0.05 |      - |     - |     - |         - |

As expected, the `Array.Empty` is clear winner. That makes sense, because it just returns a reference to a [static generic class with a static field holding the empty array][2]. 

The _Ctor_ and _CtorInit_ are virually the same, because it's just a different syntax for same IL. The downside is obviously the allocation of the real array, there's no caching, etc.

The `Enumerable.Empty` version is slowest, kind of expected. But surprisingly it does not allocate. The reason is the implementation behind it is `EmptyPartition<TElement>` with [specific `ToArray` implementation][3] where again `Array.Empty` is used. By the way, the file where `EmptyPartition<TElement>` is, is called `Partition.SpeedOpt.cs`.

OK, that was plain old array. But how about the list (that I actually needed)?

#### List

The list is different because there's no `List.Empty` or something like that. In the similar fashion I used `new List<TestList>()` (_Ctor_), `new List<TestList>(0)` (_Ctor0_), `Array.Empty<TestList>().ToList()` (_ArrayEmpty_) and `Enumerable.Empty<TestList>().ToList()` (_EnumerableEmpty_).

The first two look the same, but `Ctor0` has a a little bit more [code][4] to execute (including branching).

|          Method |      Mean |     Error |    StdDev | Ratio | RatioSD |  Gen 0 | Gen 1 | Gen 2 | Allocated |
|---------------- |----------:|----------:|----------:|------:|--------:|-------:|------:|------:|----------:|
|            Ctor |  5.973 ns | 0.1152 ns | 0.1077 ns |  1.00 |    0.00 | 0.0102 |     - |     - |      32 B |
|           Ctor0 | 12.417 ns | 0.3100 ns | 0.3317 ns |  2.09 |    0.08 | 0.0102 |     - |     - |      32 B |
|      ArrayEmpty | 39.949 ns | 0.1956 ns | 0.1527 ns |  6.71 |    0.12 | 0.0101 |     - |     - |      32 B |
| EnumerableEmpty | 16.719 ns | 0.4013 ns | 0.6366 ns |  2.87 |    0.12 | 0.0102 |     - |     - |      32 B |

So, no matter the approach all allocate and allocate the same amount (the list itself, which in turn contains the array and 2 `int` fields).

Surprisingly, the _Ctor_ compared to _Ctor0_ is about a half. I wasn't expecting that much of a difference. Learning new stuff...

The _EnumerableEmpty_ is next and again relying on the `EmptyPartition<TElement>`'s [specific `ToList` implementation][5] (which in turn just does the same call as _Ctor_). 

Finally, the _ArrayEmpty_ is slowest because there's no specific optimization for this case.

#### Summary

The fastest way to get an empty array in using `Array.Empty<T>()` call. For list, it is just using `new List<T>()` aka the most straightforward way. No crazy ideas.

#### Appendix

Execution was done in this environment.

```text
BenchmarkDotNet=v0.12.1, OS=Windows 10.0.18363.959 (1909/November2018Update/19H2)
Intel Core i5-7500 CPU 3.40GHz (Kaby Lake), 1 CPU, 4 logical and 4 physical cores
.NET Core SDK=3.1.302
  [Host]     : .NET Core 3.1.6 (CoreCLR 4.700.20.26901, CoreFX 4.700.20.31603), X64 RyuJIT
  DefaultJob : .NET Core 3.1.6 (CoreCLR 4.700.20.26901, CoreFX 4.700.20.31603), X64 RyuJIT
```

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.array.empty
[2]: https://source.dot.net/#System.Private.CoreLib/Array.cs,702
[3]: https://source.dot.net/#System.Linq/System/Linq/Partition.SpeedOpt.cs,79
[4]: https://source.dot.net/#System.Private.CoreLib/List.cs,46
[5]: https://source.dot.net/#System.Linq/System/Linq/Partition.SpeedOpt.cs,81