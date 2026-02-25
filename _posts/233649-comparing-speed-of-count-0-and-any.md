---
title: |-
  Comparing speed of "Count > 0" and "Any"
date: 2017-09-29T11:59:00Z
tags:
  - C#
  - .NET
  - LINQ
---
I hate seeing `Count > 0` when doing code reviews. And I always recommend using `Any` instead. It shows the intention, hence makes the code more readable, I think.

Although I would always choose readability over performance - unless in some very specific cases, with well-defined numbers - at one point I wondered whether there's a cost in using `Any`. Speed? Allocations?

<!-- excerpt -->

Me being me, I decided to test it. Maybe LINQ is optimized (yeah, I know, I could check the sources) for arrays or lists or ... Let's test.

For different collections, namely arrays (`int[]`), lists (`List<int>`) and hashtables (`HashSet<string>` and `Dictionary<int, string>`) I measured speed as a primary metric and allocations as secondary metric. The comparison was run with colections having 0, 1, 10, 20, 40, 100, 1000, 10000, 100000 and 1000000 items. Everything using .NET Core 2.0 and RyuJIT on 64-bit. Of course I used [BenchmarkDotNet][1].

The code in test was minimal.

```csharp
collection.[Count|Length] > 0
collection.Any()
collection.Count() > 0
```

The `Count() > 0` is there because it's the same for arrays and rest of the collections, compared to `Length` (arrays) and `Count` (rest), which makes it easy to swap collections.

#### Array (`int[]`)

 |         Method |   Count |       Mean |     Error |    StdDev | Scaled | ScaledSD |  Gen 0 | Allocated |
 |--------------- |-------- |-----------:|----------:|----------:|-------:|---------:|-------:|----------:|
 | **NativeProperty** |       **0** |  **0.0045 ns** | **0.0050 ns** | **0.0047 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |       0 | 11.0969 ns | 0.1697 ns | 0.1587 ns |      ? |        ? |      - |       0 B |
 |      LinqCount |       0 | 17.7044 ns | 0.2597 ns | 0.2429 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |       **1** |  **0.0059 ns** | **0.0085 ns** | **0.0076 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |       1 | 12.6901 ns | 0.2878 ns | 0.3426 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |       1 | 17.5033 ns | 0.1709 ns | 0.1599 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |      **10** |  **0.0022 ns** | **0.0060 ns** | **0.0056 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |      10 | 13.0081 ns | 0.2583 ns | 0.2417 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |      10 | 17.8659 ns | 0.3426 ns | 0.3205 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |      **20** |  **0.0000 ns** | **0.0000 ns** | **0.0000 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |      20 | 12.4873 ns | 0.0690 ns | 0.0645 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |      20 | 17.3086 ns | 0.0855 ns | 0.0799 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |      **40** |  **0.0020 ns** | **0.0038 ns** | **0.0035 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |      40 | 12.4498 ns | 0.0390 ns | 0.0346 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |      40 | 17.3174 ns | 0.0873 ns | 0.0817 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |     **100** |  **0.0077 ns** | **0.0093 ns** | **0.0073 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |     100 | 12.4520 ns | 0.0284 ns | 0.0265 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |     100 | 17.3046 ns | 0.0652 ns | 0.0578 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |    **1000** |  **0.0032 ns** | **0.0047 ns** | **0.0044 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |    1000 | 12.4434 ns | 0.0126 ns | 0.0105 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |    1000 | 17.2494 ns | 0.0861 ns | 0.0805 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |   **10000** |  **0.0046 ns** | **0.0053 ns** | **0.0049 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |   10000 | 12.2897 ns | 0.0397 ns | 0.0371 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |   10000 | 17.3308 ns | 0.0877 ns | 0.0820 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** |  **100000** |  **0.0017 ns** | **0.0023 ns** | **0.0022 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny |  100000 | 11.9721 ns | 0.0468 ns | 0.0438 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount |  100000 | 17.3390 ns | 0.0954 ns | 0.0892 ns |      ? |        ? |      - |       0 B |
 | **NativeProperty** | **1000000** |  **0.0017 ns** | **0.0031 ns** | **0.0029 ns** |      **?** |        **?** |      **-** |       **0 B** |
 |        LinqAny | 1000000 | 12.0244 ns | 0.0565 ns | 0.0529 ns |      ? |        ? | 0.0102 |      32 B |
 |      LinqCount | 1000000 | 17.2599 ns | 0.0525 ns | 0.0491 ns |      ? |        ? |      - |       0 B |

Without any surprise the property beats LINQ hard. Four orders of magnitude. For non-empty collections there's small allocation (_32B_) in `Any` in _Gen 0_. Across the array sizes the `Any` is roughly 1/3 faster than using `Count`.

#### List (`List<int>`)

 |         Method |   Count |       Mean |     Error |    StdDev |   Scaled | ScaledSD |  Gen 0 | Allocated |
 |--------------- |-------- |-----------:|----------:|----------:|---------:|---------:|-------:|----------:|
 | **NativeProperty** |       **0** |  **0.1002 ns** | **0.0016 ns** | **0.0010 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       0 | 15.0860 ns | 0.0501 ns | 0.0418 ns |   150.53 |     1.55 | 0.0127 |      40 B |
 |      LinqCount |       0 |  5.1146 ns | 0.1132 ns | 0.0884 ns |    51.03 |     0.98 |      - |       0 B |
 | **NativeProperty** |       **1** |  **0.0218 ns** | **0.0037 ns** | **0.0034 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       1 | 14.0525 ns | 0.0680 ns | 0.0568 ns |   661.02 |   116.56 | 0.0127 |      40 B |
 |      LinqCount |       1 |  5.0817 ns | 0.0361 ns | 0.0337 ns |   239.04 |    42.17 |      - |       0 B |
 | **NativeProperty** |      **10** |  **0.0183 ns** | **0.0092 ns** | **0.0086 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      10 | 14.1007 ns | 0.0308 ns | 0.0288 ns | 1,114.16 |   790.07 | 0.0127 |      40 B |
 |      LinqCount |      10 |  5.0819 ns | 0.0241 ns | 0.0226 ns |   401.54 |   284.75 |      - |       0 B |
 | **NativeProperty** |      **20** |  **0.1020 ns** | **0.0018 ns** | **0.0015 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      20 | 13.9176 ns | 0.0912 ns | 0.0762 ns |   136.44 |     2.08 | 0.0127 |      40 B |
 |      LinqCount |      20 |  5.0923 ns | 0.0367 ns | 0.0286 ns |    49.92 |     0.76 |      - |       0 B |
 | **NativeProperty** |      **40** |  **0.0166 ns** | **0.0054 ns** | **0.0050 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      40 | 14.0572 ns | 0.0448 ns | 0.0420 ns |   943.22 |   339.03 | 0.0127 |      40 B |
 |      LinqCount |      40 |  5.0658 ns | 0.0266 ns | 0.0249 ns |   339.91 |   122.19 |      - |       0 B |
 | **NativeProperty** |     **100** |  **0.0196 ns** | **0.0039 ns** | **0.0031 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |     100 | 13.9391 ns | 0.0704 ns | 0.0659 ns |   726.36 |   114.43 | 0.0127 |      40 B |
 |      LinqCount |     100 |  5.0841 ns | 0.0297 ns | 0.0278 ns |   264.93 |    41.74 |      - |       0 B |
 | **NativeProperty** |    **1000** |  **0.0201 ns** | **0.0098 ns** | **0.0092 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |    1000 | 14.0715 ns | 0.0438 ns | 0.0410 ns |   920.55 |   596.25 | 0.0127 |      40 B |
 |      LinqCount |    1000 |  5.0706 ns | 0.0300 ns | 0.0281 ns |   331.72 |   214.86 |      - |       0 B |
 | **NativeProperty** |   **10000** |  **0.0172 ns** | **0.0069 ns** | **0.0064 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |   10000 | 14.0625 ns | 0.0437 ns | 0.0387 ns |   999.21 |   528.96 | 0.0127 |      40 B |
 |      LinqCount |   10000 |  5.0892 ns | 0.0090 ns | 0.0071 ns |   361.61 |   191.43 |      - |       0 B |
 | **NativeProperty** |  **100000** |  **0.0938 ns** | **0.0086 ns** | **0.0080 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |  100000 | 14.0395 ns | 0.0494 ns | 0.0438 ns |   150.74 |    12.27 | 0.0127 |      40 B |
 |      LinqCount |  100000 |  5.0936 ns | 0.0194 ns | 0.0181 ns |    54.69 |     4.45 |      - |       0 B |
 | **NativeProperty** | **1000000** |  **0.0223 ns** | **0.0018 ns** | **0.0014 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny | 1000000 | 14.5025 ns | 0.3087 ns | 0.3170 ns |   652.04 |    40.63 | 0.0127 |      40 B |
 |      LinqCount | 1000000 |  5.0870 ns | 0.0094 ns | 0.0083 ns |   228.71 |    13.40 |      - |       0 B |

Again, the property is winner in all categories. But compared to arrays, the LINQ is now only about two to maybe-three orders of magnitude slower. Also `Any` is now slower, and with small allocation, than `Count`, about 2,8×. The numbers are fairly consistent across list sizes.

#### Hashset (`HashSet<string>`)

 |         Method |   Count |       Mean |     Error |    StdDev |   Scaled | ScaledSD |  Gen 0 | Allocated |
 |--------------- |-------- |-----------:|----------:|----------:|---------:|---------:|-------:|----------:|
 | **NativeProperty** |       **0** |  **0.0179 ns** | **0.0060 ns** | **0.0056 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       0 | 36.2103 ns | 0.1669 ns | 0.1561 ns | 2,282.85 |   887.64 | 0.0127 |      40 B |
 |      LinqCount |       0 | 13.7829 ns | 0.0503 ns | 0.0470 ns |   868.94 |   337.86 |      - |       0 B |
 | **NativeProperty** |       **1** |  **0.0231 ns** | **0.0047 ns** | **0.0042 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       1 | 36.5008 ns | 0.1974 ns | 0.1846 ns | 1,634.75 |   322.82 | 0.0127 |      40 B |
 |      LinqCount |       1 | 14.0201 ns | 0.0349 ns | 0.0309 ns |   627.92 |   123.96 |      - |       0 B |
 | **NativeProperty** |      **10** |  **0.0223 ns** | **0.0046 ns** | **0.0043 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      10 | 36.7535 ns | 0.1922 ns | 0.1798 ns | 1,715.10 |   390.09 | 0.0127 |      40 B |
 |      LinqCount |      10 | 14.0163 ns | 0.0671 ns | 0.0628 ns |   654.07 |   148.76 |      - |       0 B |
 | **NativeProperty** |      **20** |  **0.0203 ns** | **0.0028 ns** | **0.0027 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      20 | 37.3105 ns | 0.1733 ns | 0.1621 ns | 1,870.32 |   260.09 | 0.0127 |      40 B |
 |      LinqCount |      20 | 14.0395 ns | 0.0970 ns | 0.0859 ns |   703.78 |    97.91 |      - |       0 B |
 | **NativeProperty** |      **40** |  **0.0202 ns** | **0.0052 ns** | **0.0049 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      40 | 36.8632 ns | 0.2524 ns | 0.2361 ns | 1,960.62 |   605.45 | 0.0127 |      40 B |
 |      LinqCount |      40 | 14.0162 ns | 0.0707 ns | 0.0662 ns |   745.47 |   230.18 |      - |       0 B |
 | **NativeProperty** |     **100** |  **0.0177 ns** | **0.0073 ns** | **0.0069 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |     100 | 36.9482 ns | 0.2461 ns | 0.2302 ns | 2,493.76 | 1,136.69 | 0.0127 |      40 B |
 |      LinqCount |     100 | 14.0010 ns | 0.0924 ns | 0.0864 ns |   944.98 |   430.73 |      - |       0 B |
 | **NativeProperty** |    **1000** |  **0.1018 ns** | **0.0092 ns** | **0.0086 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |    1000 | 36.7891 ns | 0.1775 ns | 0.1660 ns |   364.00 |    30.91 | 0.0127 |      40 B |
 |      LinqCount |    1000 | 14.0353 ns | 0.0716 ns | 0.0669 ns |   138.87 |    11.79 |      - |       0 B |
 | **NativeProperty** |   **10000** |  **0.0196 ns** | **0.0038 ns** | **0.0033 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |   10000 | 36.7013 ns | 0.1833 ns | 0.1715 ns | 1,933.42 |   364.57 | 0.0127 |      40 B |
 |      LinqCount |   10000 | 14.0602 ns | 0.1047 ns | 0.0979 ns |   740.69 |   139.72 |      - |       0 B |
 | **NativeProperty** |  **100000** |  **0.0219 ns** | **0.0049 ns** | **0.0046 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |  100000 | 36.8593 ns | 0.1686 ns | 0.1577 ns | 1,762.18 |   420.58 | 0.0127 |      40 B |
 |      LinqCount |  100000 | 14.1420 ns | 0.0635 ns | 0.0563 ns |   676.11 |   161.36 |      - |       0 B |
 | **NativeProperty** | **1000000** |  **0.0155 ns** | **0.0070 ns** | **0.0066 ns** |     **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny | 1000000 | 36.8154 ns | 0.1671 ns | 0.1481 ns | 2,913.01 | 1,469.20 | 0.0127 |      40 B |
 |      LinqCount | 1000000 | 13.8831 ns | 0.0609 ns | 0.0540 ns | 1,098.50 |   554.03 |      - |       0 B |

For hashsets the property again wins and the times are similar to what we can see with lists (including the consistency). The LINQ is two to three times slower compared to lists (with same allocations), with `Any` being slower than `Count`, about 2,6×.

#### Dictionary (`Dictionary<int, string>`)

 |         Method |   Count |       Mean |     Error |    StdDev | Scaled | ScaledSD |  Gen 0 | Allocated |
 |--------------- |-------- |-----------:|----------:|----------:|-------:|---------:|-------:|----------:|
 | **NativeProperty** |       **0** |  **0.2841 ns** | **0.0099 ns** | **0.0093 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       0 | 28.5678 ns | 0.1609 ns | 0.1505 ns | 100.67 |     3.28 | 0.0178 |      56 B |
 |      LinqCount |       0 | 11.1186 ns | 0.0465 ns | 0.0412 ns |  39.18 |     1.27 |      - |       0 B |
 | **NativeProperty** |       **1** |  **0.2833 ns** | **0.0092 ns** | **0.0081 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |       1 | 31.5503 ns | 0.1500 ns | 0.1403 ns | 111.44 |     3.13 | 0.0178 |      56 B |
 |      LinqCount |       1 | 11.0876 ns | 0.0288 ns | 0.0270 ns |  39.16 |     1.09 |      - |       0 B |
 | **NativeProperty** |      **10** |  **0.2867 ns** | **0.0069 ns** | **0.0064 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      10 | 31.2205 ns | 0.1523 ns | 0.1425 ns | 108.93 |     2.38 | 0.0178 |      56 B |
 |      LinqCount |      10 | 10.9309 ns | 0.0144 ns | 0.0120 ns |  38.14 |     0.82 |      - |       0 B |
 | **NativeProperty** |      **20** |  **0.2817 ns** | **0.0066 ns** | **0.0055 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      20 | 30.3300 ns | 0.1681 ns | 0.1572 ns | 107.71 |     2.11 | 0.0178 |      56 B |
 |      LinqCount |      20 | 10.8964 ns | 0.0502 ns | 0.0470 ns |  38.70 |     0.75 |      - |       0 B |
 | **NativeProperty** |      **40** |  **0.2804 ns** | **0.0076 ns** | **0.0071 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |      40 | 30.3726 ns | 0.2639 ns | 0.2469 ns | 108.39 |     2.84 | 0.0178 |      56 B |
 |      LinqCount |      40 | 12.1105 ns | 0.0150 ns | 0.0125 ns |  43.22 |     1.08 |      - |       0 B |
 | **NativeProperty** |     **100** |  **0.2859 ns** | **0.0049 ns** | **0.0046 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |     100 | 30.1560 ns | 0.0868 ns | 0.0678 ns | 105.49 |     1.66 | 0.0178 |      56 B |
 |      LinqCount |     100 | 12.1203 ns | 0.0183 ns | 0.0121 ns |  42.40 |     0.66 |      - |       0 B |
 | **NativeProperty** |    **1000** |  **0.2817 ns** | **0.0088 ns** | **0.0083 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |    1000 | 30.2199 ns | 0.1485 ns | 0.1389 ns | 107.38 |     3.09 | 0.0178 |      56 B |
 |      LinqCount |    1000 | 10.9124 ns | 0.0458 ns | 0.0428 ns |  38.77 |     1.11 |      - |       0 B |
 | **NativeProperty** |   **10000** |  **0.2849 ns** | **0.0104 ns** | **0.0092 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |   10000 | 30.1828 ns | 0.1297 ns | 0.1214 ns | 106.05 |     3.31 | 0.0178 |      56 B |
 |      LinqCount |   10000 | 10.8933 ns | 0.0517 ns | 0.0484 ns |  38.27 |     1.20 |      - |       0 B |
 | **NativeProperty** |  **100000** |  **0.2824 ns** | **0.0106 ns** | **0.0099 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny |  100000 | 30.2127 ns | 0.1519 ns | 0.1421 ns | 107.11 |     3.65 | 0.0178 |      56 B |
 |      LinqCount |  100000 | 10.9874 ns | 0.0242 ns | 0.0202 ns |  38.95 |     1.32 |      - |       0 B |
 | **NativeProperty** | **1000000** |  **0.2892 ns** | **0.0063 ns** | **0.0045 ns** |   **1.00** |     **0.00** |      **-** |       **0 B** |
 |        LinqAny | 1000000 | 30.3330 ns | 0.0674 ns | 0.0598 ns | 104.92 |     1.61 | 0.0178 |      56 B |
 |      LinqCount | 1000000 | 10.9556 ns | 0.0344 ns | 0.0268 ns |  37.89 |     0.58 |      - |       0 B |

This time, although the property again wins, it's not in hundredths of nanoseconds, but in tenths. LINQ is a bit faster than in hashsets, with `Any` being slower than `Count` (as with lists and hashsets), about 2,6×. The allocation raised to _56B_ (in _Gen 0_) across the sizes.

#### Summary

What we can deduct from these numbers? Here are my observations.

* Using a property directly is heaps faster than LINQ.
* The `Count` method is indeed optimized for collections with known length, so it's not counting the elements one by one.
* Except for arrays, the `Count` method is faster than `Any`, but not much.
* `Any` allocates some bytes (depending on collection type). Although it's a small allocation, it's an allocation nonetheless.

Does it mean I'll stop using `Any`? No. As I said, `Any` shows the intent clearly. I write readable code first, often that also means performant enough, and optimize later when needed and backed by numbers.

[1]: http://benchmarkdotnet.org/