---
title: |-
  Is it faster to index into an array or use switch statement for lookups?
date: 2026-02-25T10:56:00Z
tags:
  - .NET
  - C#
  - Performance
---
While working on a PR in `Microsoft.Extensions.Logging` I saw two variations of code and I wanted to check which one is faster. Not that it mattered in this piece of code, but every little counts and also, I like to explore random things.

Assume you have some numbers (zero-based) that represent predefined strings. And you want to convert those numbers. 

<!-- excerpt -->

#### Code

One way to do it is to put the strings into an array and directly index into it.

```csharp
static readonly string[] Strings =
[
    "Trace",
    "Debug",
    "Information",
    "Warning",
    "Error",
    "Critical",
    "None",
];

public string Array(int i)
    => i < Strings.Length
        ? Strings[i]
        : i.ToString();
```

Simple enough and you have the benefit of reusing the array elsewhere when needed.

Another way to do it is to use switch expression (or switch statement or plain old ifs). This generally compiles - for dense values - to jump table, which is logically equvivalent to what the `Array` version is doing.

```
public string Switch(int i)
    => i switch
    {
        0 => "Trace",
        1 => "Debug",
        2 => "Information",
        3 => "Warning",
        4 => "Error",
        5 => "Critical",
        6 => "None",
        _ => i.ToString(),
    };
```

Before looking at the results, pause and take a guess.

I like the directness of switch expression and hence it was my favorite. But purely because of syntax. For performance I had no theory why one should be faster than other (hence I'm benchmarking it).

#### Results

| Method | i | Mean      | Error     | StdDev    | Median    |
|------- |-- |----------:|----------:|----------:|----------:|
| Array  | 0 | 0.6266 ns | 0.0083 ns | 0.0421 ns | 0.6196 ns |
| Switch | 0 | 0.2909 ns | 0.0376 ns | 0.1918 ns | 0.4013 ns |
| Array  | 1 | 0.3694 ns | 0.0386 ns | 0.1933 ns | 0.2540 ns |
| Switch | 1 | 0.2992 ns | 0.0411 ns | 0.2088 ns | 0.4200 ns |
| Array  | 2 | 0.3619 ns | 0.0401 ns | 0.2001 ns | 0.2471 ns |
| Switch | 2 | 0.4052 ns | 0.0066 ns | 0.0334 ns | 0.4053 ns |
| Array  | 3 | 0.3354 ns | 0.0332 ns | 0.1667 ns | 0.2424 ns |
| Switch | 3 | 0.1475 ns | 0.0390 ns | 0.1982 ns | 0.0156 ns |
| Array  | 4 | 0.5061 ns | 0.0381 ns | 0.1909 ns | 0.6168 ns |
| Switch | 4 | 0.1552 ns | 0.0375 ns | 0.1896 ns | 0.0349 ns |
| Array  | 5 | 0.6364 ns | 0.0059 ns | 0.0297 ns | 0.6354 ns |
| Switch | 5 | 0.1437 ns | 0.0369 ns | 0.1878 ns | 0.0244 ns |
| Array  | 6 | 0.5053 ns | 0.0392 ns | 0.1997 ns | 0.6210 ns |
| Switch | 6 | 0.4150 ns | 0.0064 ns | 0.0323 ns | 0.4130 ns |
| Array  | 7 | 1.2289 ns | 0.0056 ns | 0.0280 ns | 1.2287 ns |
| Switch | 7 | 1.1047 ns | 0.0087 ns | 0.0437 ns | 1.0973 ns |

OK. First and foremost, looking at those numbers it is clear that none of this matter. :) The hardcoded values are all under 1 nanosecond. The `Switch` version is consistently faster than `Array` except for `2`, but in those ranges I consider those numbers more or less identical (Branch prediction probably helped, but it helped in both cases.). For `7` we see the fallback to `ToString`, which has non-trivial cost (especially for big numbers). 

What does it mean? It means that there's no surprise and you should use whichever version fits your needs (or preference).

#### Appendix

```text
BenchmarkDotNet v0.15.8, Windows 11 (10.0.26200.7781/25H2/2025Update/HudsonValley2)
11th Gen Intel Core i9-11900 2.50GHz, 1 CPU, 16 logical and 8 physical cores
.NET SDK 10.0.103
  [Host]  : .NET 10.0.3 (10.0.3, 10.0.326.7603), X64 RyuJIT x86-64-v4
  LongRun : .NET 10.0.3 (10.0.3, 10.0.326.7603), X64 RyuJIT x86-64-v4
```

```csharp
[LongRunJob]
public class Bench
{
    public static IEnumerable<int> Values() => [0, 1, 2, 3, 4, 5, 6, 7];

    static readonly string[] Strings =
    [
        "Trace",
        "Debug",
        "Information",
        "Warning",
        "Error",
        "Critical",
        "None",
    ];

    [Benchmark, ArgumentsSource(nameof(Values))]
    public string Array(int i)
        => i < Strings.Length
            ? Strings[i]
            : i.ToString();

    [Benchmark, ArgumentsSource(nameof(Values))]
    public string Switch(int i)
        => i switch
        {
            0 => "Trace",
            1 => "Debug",
            2 => "Information",
            3 => "Warning",
            4 => "Error",
            5 => "Critical",
            6 => "None",
            _ => i.ToString(),
        };
}
```