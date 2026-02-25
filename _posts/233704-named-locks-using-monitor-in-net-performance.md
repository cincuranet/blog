---
title: |-
  Named locks (using Monitor) in .NET: Performance
date: 2018-02-26T06:00:00Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
One thing remaining from [last week's exploration of named locks][1] is performance. My personal preference was and still is `ConcurrentDictionary<TKey, TValue>`, but what if the _string interning_ is 10 times faster? That would convince me to thing about it for usage.

<!-- excerpt -->

#### What to measure?

I can measure how long does it take to get a lock using one or the other method, but that might be misleading. Both methods need to keep collection of "locks" and look up the one requested. This might have a different complexity (the infamous big-O) based on number of items. Similarly, both methods are, given we're talking about multithreaded usage here, "thread safe", thus accessing from multiple threads might change (i.e. internal locking or thread/CPU/bucket/... affinity) the outcome. And finally, the first access might be (or not) more costly (because the item is created) compared to subsequent ones.

Although you can throw into the mix more variables, these three - number of locks, number of threads and number of lock accesses - are the ones I'll use to get the numbers. The last two, and especially the last one, are very synthetic in my test. Because in real code other factors affect the speed (like CPU cache hits or thrashing).

I'm testing with number of locks 1, 20, 100 and 1000. No particular reason, just values that seemed interesting to me. For numbers of threads (using Tasks) I used 1-6 on Intel Core i5-7500 CPU 3.40GHz (4 logical cores and 4 physical cores). You might be wondering why I went to 6 and didn't stop at 4 (because that's the number of cores the CPU has). I wanted to also test the behavior when the processor is slightly oversubscribed and probably some thrashing happens. For number of lock accesses I selected 1, 10, 20, 100, 400, 1000 and 65535. The execution environment is .NET Core 2.0.5 (Framework 4.6.26020.03), 64bit RyuJIT.

To make it more digestible I'll focus on number of locks and include the remaining variables in a single graph. The raw numbers (including allocations) and code are available at the end of this post.

The graphs show comparison where `> 0%` means `ConcurrentDictionary<TKey, TValue>` is faster. Also you can zoom in since these are vector graphics.

#### 1 lock

Well, with one lock it's questionable whether you need named locks, but let's take it as an edge case and starting point.

![Locks=1]({{ include "post_ilink" page "L1.svg" }})

For one lock the string interning is winner for small number of accesses, although it's starting to lose its edge once number of accesses starts growing. The numbers for number of tasks are not smooth, yet one can see small trend across.

#### 20 locks

This number of locks (together with 100) I consider as something most developers would need. Not a huge number where I would start thinking about different solution (and maybe even distributed locks).

![Locks=20]({{ include "post_ilink" page "L20.svg" }})

The graph has similar shape as the previous one, but smoother (also the range is different). Somewhere around 20 accesses the `ConcurrentDictionary<TKey, TValue>` starts to clearly win. I hope for 100 locks the results will be similar, because that would validate my `ConcurrentDictionary<TKey, TValue>` preference. :)

#### 100 locks

As I said in paragraph for 20 locks, this number of locks feels like a good fit for the solution we're talking here about.

![Locks=100]({{ include "post_ilink" page "L100.svg" }})

For one access the drop continues, but again around 20 accesses the `ConcurrentDictionary<TKey, TValue>` starts to win. And the trend continues. I like that. :)

#### 1000 locks

Mostly to see whether there will be some drop, I tested also 1000 locks.

![Locks=1000]({{ include "post_ilink" page "L1000.svg" }})

Luckily, the results are not surprising and follow the trend started in previous instances.

#### Summary

I prefer clean code over some smart (ab)use and `ConcurrentDictionary<TKey, TValue>` fits into this box perfectly. Usually this is tied to some small (performance) tradeoffs (Ever seen heavily optimized code?). However, I'm happy to see in this case clean code and performance go hand in hand.

As a bonus `ConcurrentDictionary<TKey, TValue>` gives you more options - different lock types, different keys, ... Looks like sometimes we can have nice things.

> [Implementation][1]

#### Appendix

##### Raw numbers

|             Method | Tasks | Locks | Loops |              Mean |             Error |          StdDev | Scaled | ScaledSD |        Gen 0 |     Gen 1 |    Gen 2 | Allocated |
|------------------- |------ |------ |------ |------------------:|------------------:|----------------:|-------:|---------:|-------------:|----------:|---------:|----------:|
| TestDictionaryLock |     1 |     1 |     1 |          2.384 μs |         0.2829 μs |       0.0160 μs |   1.00 |     0.00 |       0.3166 |         - |        - |     896 B |
|     TestInternLock |     1 |     1 |     1 |          1.834 μs |         0.4310 μs |       0.0244 μs |   0.77 |     0.01 |       0.1163 |         - |        - |     336 B |
| TestDictionaryLock |     1 |     1 |    10 |          3.582 μs |         0.8946 μs |       0.0505 μs |   1.00 |     0.00 |       0.4120 |         - |        - |     896 B |
|     TestInternLock |     1 |     1 |    10 |          3.776 μs |         0.0722 μs |       0.0041 μs |   1.05 |     0.01 |       0.2098 |         - |        - |     336 B |
| TestDictionaryLock |     1 |     1 |    20 |          5.801 μs |         0.0642 μs |       0.0036 μs |   1.00 |     0.00 |       0.5112 |         - |        - |     896 B |
|     TestInternLock |     1 |     1 |    20 |          5.620 μs |         0.2421 μs |       0.0137 μs |   0.97 |     0.00 |       0.3128 |         - |        - |     336 B |
| TestDictionaryLock |     1 |     1 |   100 |         16.941 μs |         0.3988 μs |       0.0225 μs |   1.00 |     0.00 |       1.3123 |         - |        - |     896 B |
|     TestInternLock |     1 |     1 |   100 |         17.638 μs |        11.0584 μs |       0.6248 μs |   1.04 |     0.03 |       1.1292 |         - |        - |     336 B |
| TestDictionaryLock |     1 |     1 |   400 |         79.894 μs |         4.8768 μs |       0.2755 μs |   1.00 |     0.00 |       4.3945 |         - |        - |     896 B |
|     TestInternLock |     1 |     1 |   400 |         79.017 μs |         5.8409 μs |       0.3300 μs |   0.99 |     0.00 |       4.1504 |         - |        - |     336 B |
| TestDictionaryLock |     1 |     1 |  1000 |        164.545 μs |        37.0714 μs |       2.0946 μs |   1.00 |     0.00 |      10.4980 |         - |        - |     920 B |
|     TestInternLock |     1 |     1 |  1000 |        167.234 μs |        39.4734 μs |       2.2303 μs |   1.02 |     0.02 |      10.2539 |         - |        - |     360 B |
| TestDictionaryLock |     1 |     1 | 65535 |      6,725.112 μs |       800.5482 μs |      45.2325 μs |   1.00 |     0.00 |     664.0625 |         - |        - |     920 B |
|     TestInternLock |     1 |     1 | 65535 |      8,319.501 μs |       452.4859 μs |      25.5663 μs |   1.24 |     0.01 |     656.2500 |         - |        - |     360 B |
| TestDictionaryLock |     1 |    20 |     1 |          5.966 μs |         0.1880 μs |       0.0106 μs |   1.00 |     0.00 |       0.9537 |         - |        - |     896 B |
|     TestInternLock |     1 |    20 |     1 |          5.561 μs |         0.1257 μs |       0.0071 μs |   0.93 |     0.00 |       0.3128 |         - |        - |     336 B |
| TestDictionaryLock |     1 |    20 |    10 |         37.583 μs |         1.0196 μs |       0.0576 μs |   1.00 |     0.00 |       2.7466 |         - |        - |     896 B |
|     TestInternLock |     1 |    20 |    10 |         37.302 μs |         1.9679 μs |       0.1112 μs |   0.99 |     0.00 |       2.1362 |         - |        - |     336 B |
| TestDictionaryLock |     1 |    20 |    20 |         79.149 μs |         3.4790 μs |       0.1966 μs |   1.00 |     0.00 |       4.7607 |         - |        - |     896 B |
|     TestInternLock |     1 |    20 |    20 |         79.538 μs |         9.8948 μs |       0.5591 μs |   1.00 |     0.01 |       4.1504 |         - |        - |     336 B |
| TestDictionaryLock |     1 |    20 |   100 |        231.839 μs |        12.6745 μs |       0.7161 μs |   1.00 |     0.00 |      20.9961 |         - |        - |     920 B |
|     TestInternLock |     1 |    20 |   100 |        275.857 μs |        30.7735 μs |       1.7388 μs |   1.19 |     0.01 |      20.5078 |         - |        - |     360 B |
| TestDictionaryLock |     1 |    20 |   400 |        858.758 μs |         7.0789 μs |       0.4000 μs |   1.00 |     0.00 |      82.0313 |         - |        - |     920 B |
|     TestInternLock |     1 |    20 |   400 |      1,038.687 μs |        53.0253 μs |       2.9960 μs |   1.21 |     0.00 |      80.0781 |         - |        - |     360 B |
| TestDictionaryLock |     1 |    20 |  1000 |      2,118.682 μs |       140.2521 μs |       7.9245 μs |   1.00 |     0.00 |     203.1250 |         - |        - |     920 B |
|     TestInternLock |     1 |    20 |  1000 |      2,663.460 μs |       124.4367 μs |       7.0309 μs |   1.26 |     0.00 |     203.1250 |         - |        - |     360 B |
| TestDictionaryLock |     1 |    20 | 65535 |    138,224.428 μs |    12,331.6683 μs |     696.7621 μs |   1.00 |     0.00 |   13312.5000 |         - |        - |     920 B |
|     TestInternLock |     1 |    20 | 65535 |    167,835.182 μs |    18,773.5246 μs |   1,060.7390 μs |   1.21 |     0.01 |   13312.5000 |         - |        - |       0 B |
| TestDictionaryLock |     1 |   100 |     1 |         38.555 μs |         2.0618 μs |       0.1165 μs |   1.00 |     0.00 |       7.3853 |         - |        - |     896 B |
|     TestInternLock |     1 |   100 |     1 |         16.545 μs |         1.1577 μs |       0.0654 μs |   0.43 |     0.00 |       1.1292 |         - |        - |     336 B |
| TestDictionaryLock |     1 |   100 |    10 |        171.770 μs |        17.4924 μs |       0.9884 μs |   1.00 |     0.00 |      17.0898 |         - |        - |     920 B |
|     TestInternLock |     1 |   100 |    10 |        168.112 μs |        17.4364 μs |       0.9852 μs |   0.98 |     0.01 |      10.2539 |         - |        - |     360 B |
| TestDictionaryLock |     1 |   100 |    20 |        246.696 μs |        16.3582 μs |       0.9243 μs |   1.00 |     0.00 |      26.8555 |         - |        - |     920 B |
|     TestInternLock |     1 |   100 |    20 |        263.627 μs |        56.1612 μs |       3.1732 μs |   1.07 |     0.01 |      20.5078 |         - |        - |     360 B |
| TestDictionaryLock |     1 |   100 |   100 |      1,113.694 μs |        91.1594 μs |       5.1507 μs |   1.00 |     0.00 |     107.4219 |         - |        - |     920 B |
|     TestInternLock |     1 |   100 |   100 |      1,291.072 μs |        26.6638 μs |       1.5066 μs |   1.16 |     0.00 |     101.5625 |         - |        - |     360 B |
| TestDictionaryLock |     1 |   100 |   400 |      4,264.538 μs |       294.9824 μs |      16.6671 μs |   1.00 |     0.00 |     406.2500 |         - |        - |     920 B |
|     TestInternLock |     1 |   100 |   400 |      5,098.486 μs |       210.6562 μs |      11.9025 μs |   1.20 |     0.00 |     406.2500 |         - |        - |     360 B |
| TestDictionaryLock |     1 |   100 |  1000 |     10,659.689 μs |       651.4082 μs |      36.8058 μs |   1.00 |     0.00 |    1015.6250 |         - |        - |     920 B |
|     TestInternLock |     1 |   100 |  1000 |     12,669.578 μs |     1,313.1982 μs |      74.1981 μs |   1.19 |     0.01 |    1015.6250 |         - |        - |     360 B |
| TestDictionaryLock |     1 |   100 | 65535 |    684,216.566 μs |    42,044.1601 μs |   2,375.5730 μs |   1.00 |     0.00 |   66625.0000 |   62.5000 |        - |     920 B |
|     TestInternLock |     1 |   100 | 65535 |    808,516.806 μs |   187,226.6220 μs |  10,578.6513 μs |   1.18 |     0.01 |   66625.0000 |   62.5000 |        - |       0 B |
| TestDictionaryLock |     1 |  1000 |     1 |        310.825 μs |        64.3900 μs |       3.6382 μs |   1.00 |     0.00 |      85.9375 |    0.4883 |        - |     920 B |
|     TestInternLock |     1 |  1000 |     1 |        166.409 μs |         9.4303 μs |       0.5328 μs |   0.54 |     0.01 |      10.2539 |         - |        - |     360 B |
| TestDictionaryLock |     1 |  1000 |    10 |      1,359.801 μs |       136.6926 μs |       7.7234 μs |   1.00 |     0.00 |     173.8281 |    5.8594 |        - |     920 B |
|     TestInternLock |     1 |  1000 |    10 |      1,345.312 μs |       136.4554 μs |       7.7100 μs |   0.99 |     0.01 |     101.5625 |         - |        - |     360 B |
| TestDictionaryLock |     1 |  1000 |    20 |      2,484.658 μs |       378.4025 μs |      21.3804 μs |   1.00 |     0.00 |     273.4375 |    3.9063 |        - |     920 B |
|     TestInternLock |     1 |  1000 |    20 |      2,641.118 μs |        89.8266 μs |       5.0754 μs |   1.06 |     0.01 |     203.1250 |         - |        - |     360 B |
| TestDictionaryLock |     1 |  1000 |   100 |     11,515.744 μs |     1,109.4992 μs |      62.6888 μs |   1.00 |     0.00 |    1046.8750 |         - |        - |     920 B |
|     TestInternLock |     1 |  1000 |   100 |     13,108.823 μs |     2,114.1998 μs |     119.4562 μs |   1.14 |     0.01 |    1015.6250 |         - |        - |     360 B |
| TestDictionaryLock |     1 |  1000 |   400 |     43,695.877 μs |     2,398.2737 μs |     135.5069 μs |   1.00 |     0.00 |    4125.0000 |   62.5000 |        - |     920 B |
|     TestInternLock |     1 |  1000 |   400 |     51,592.297 μs |     4,701.7114 μs |     265.6554 μs |   1.18 |     0.01 |    4062.5000 |         - |        - |       0 B |
| TestDictionaryLock |     1 |  1000 |  1000 |    107,942.228 μs |     2,983.8161 μs |     168.5911 μs |   1.00 |     0.00 |   10250.0000 |   62.5000 |        - |     920 B |
|     TestInternLock |     1 |  1000 |  1000 |    128,970.444 μs |    10,872.5326 μs |     614.3183 μs |   1.19 |     0.00 |   10125.0000 |         - |        - |       0 B |
| TestDictionaryLock |     1 |  1000 | 65535 |  7,114,549.990 μs |   126,298.5357 μs |   7,136.1015 μs |   1.00 |     0.00 |  666687.5000 |  750.0000 |  62.5000 |     920 B |
|     TestInternLock |     1 |  1000 | 65535 |  8,569,304.272 μs |   354,731.5006 μs |  20,042.9876 μs |   1.20 |     0.00 |  666625.0000 |  812.5000 |  62.5000 |       0 B |
| TestDictionaryLock |     2 |     1 |     1 |          3.328 μs |         0.6476 μs |       0.0366 μs |   1.00 |     0.00 |       0.3548 |         - |        - |     976 B |
|     TestInternLock |     2 |     1 |     1 |          2.369 μs |         0.1754 μs |       0.0099 μs |   0.71 |     0.01 |       0.1526 |         - |        - |     416 B |
| TestDictionaryLock |     2 |     1 |    10 |          5.741 μs |         0.1134 μs |       0.0064 μs |   1.00 |     0.00 |       0.5417 |         - |        - |     976 B |
|     TestInternLock |     2 |     1 |    10 |          5.595 μs |         0.4719 μs |       0.0267 μs |   0.97 |     0.00 |       0.3357 |         - |        - |     416 B |
| TestDictionaryLock |     2 |     1 |    20 |          8.973 μs |         0.4680 μs |       0.0264 μs |   1.00 |     0.00 |       0.7477 |         - |        - |     976 B |
|     TestInternLock |     2 |     1 |    20 |         10.933 μs |         3.3557 μs |       0.1896 μs |   1.22 |     0.02 |       0.5341 |         - |        - |     416 B |
| TestDictionaryLock |     2 |     1 |   100 |         39.850 μs |         2.6788 μs |       0.1514 μs |   1.00 |     0.00 |       2.3804 |         - |        - |     976 B |
|     TestInternLock |     2 |     1 |   100 |         40.011 μs |         8.7853 μs |       0.4964 μs |   1.00 |     0.01 |       2.1362 |         - |        - |     416 B |
| TestDictionaryLock |     2 |     1 |   400 |        124.503 μs |        66.3677 μs |       3.7499 μs |   1.00 |     0.00 |       8.4229 |         - |        - |     990 B |
|     TestInternLock |     2 |     1 |   400 |        165.331 μs |         1.4007 μs |       0.0791 μs |   1.33 |     0.03 |       8.3008 |         - |        - |     440 B |
| TestDictionaryLock |     2 |     1 |  1000 |        197.343 μs |        62.1484 μs |       3.5115 μs |   1.00 |     0.00 |      20.7520 |         - |        - |    1000 B |
|     TestInternLock |     2 |     1 |  1000 |        260.305 μs |        20.0641 μs |       1.1337 μs |   1.32 |     0.02 |      20.5078 |         - |        - |     440 B |
| TestDictionaryLock |     2 |     1 | 65535 |     12,163.300 μs |     3,363.3907 μs |     190.0378 μs |   1.00 |     0.00 |    1328.1250 |         - |        - |    1000 B |
|     TestInternLock |     2 |     1 | 65535 |     16,024.850 μs |     1,853.4293 μs |     104.7222 μs |   1.32 |     0.02 |    1312.5000 |         - |        - |     440 B |
| TestDictionaryLock |     2 |    20 |     1 |         11.434 μs |         1.7025 μs |       0.0962 μs |   1.00 |     0.00 |       1.1902 |         - |        - |     976 B |
|     TestInternLock |     2 |    20 |     1 |          6.221 μs |         0.5643 μs |       0.0319 μs |   0.54 |     0.00 |       0.5417 |         - |        - |     416 B |
| TestDictionaryLock |     2 |    20 |    10 |         42.193 μs |         4.0355 μs |       0.2280 μs |   1.00 |     0.00 |       5.4321 |         - |        - |     976 B |
|     TestInternLock |     2 |    20 |    10 |         39.023 μs |         1.8920 μs |       0.1069 μs |   0.92 |     0.00 |       4.2114 |         - |        - |     416 B |
| TestDictionaryLock |     2 |    20 |    20 |         82.887 μs |         2.6737 μs |       0.1511 μs |   1.00 |     0.00 |       8.9111 |         - |        - |     976 B |
|     TestInternLock |     2 |    20 |    20 |         81.704 μs |         1.0930 μs |       0.0618 μs |   0.99 |     0.00 |       8.3008 |         - |        - |     416 B |
| TestDictionaryLock |     2 |    20 |   100 |        280.539 μs |         8.0558 μs |       0.4552 μs |   1.00 |     0.00 |      41.5039 |         - |        - |    1000 B |
|     TestInternLock |     2 |    20 |   100 |        332.738 μs |        31.8152 μs |       1.7976 μs |   1.19 |     0.01 |      41.0156 |         - |        - |     440 B |
| TestDictionaryLock |     2 |    20 |   400 |      1,170.990 μs |       138.5276 μs |       7.8271 μs |   1.00 |     0.00 |     164.0625 |         - |        - |    1000 B |
|     TestInternLock |     2 |    20 |   400 |      1,328.989 μs |       173.9588 μs |       9.8290 μs |   1.13 |     0.01 |     164.0625 |         - |        - |     440 B |
| TestDictionaryLock |     2 |    20 |  1000 |      2,790.911 μs |       229.8305 μs |      12.9858 μs |   1.00 |     0.00 |     410.1563 |         - |        - |    1000 B |
|     TestInternLock |     2 |    20 |  1000 |      3,223.763 μs |       581.2532 μs |      32.8419 μs |   1.16 |     0.01 |     410.1563 |         - |        - |     440 B |
| TestDictionaryLock |     2 |    20 | 65535 |    174,308.043 μs |    25,076.7397 μs |   1,416.8823 μs |   1.00 |     0.00 |   26750.0000 |         - |        - |    1000 B |
|     TestInternLock |     2 |    20 | 65535 |    206,316.910 μs |    25,221.4516 μs |   1,425.0588 μs |   1.18 |     0.01 |   26750.0000 |         - |        - |       0 B |
| TestDictionaryLock |     2 |   100 |     1 |         51.381 μs |         7.5886 μs |       0.4288 μs |   1.00 |     0.00 |       8.2397 |         - |        - |     976 B |
|     TestInternLock |     2 |   100 |     1 |         23.607 μs |         1.2819 μs |       0.0724 μs |   0.46 |     0.00 |       2.1667 |         - |        - |     416 B |
| TestDictionaryLock |     2 |   100 |    10 |        182.327 μs |        46.6198 μs |       2.6341 μs |   1.00 |     0.00 |      27.0996 |         - |        - |    1000 B |
|     TestInternLock |     2 |   100 |    10 |        166.095 μs |         1.4523 μs |       0.0821 μs |   0.91 |     0.01 |      20.5078 |         - |        - |     440 B |
| TestDictionaryLock |     2 |   100 |    20 |        300.217 μs |        24.0451 μs |       1.3586 μs |   1.00 |     0.00 |      50.2930 |         - |        - |    1000 B |
|     TestInternLock |     2 |   100 |    20 |        292.599 μs |        47.8656 μs |       2.7045 μs |   0.97 |     0.01 |      41.0156 |         - |        - |     440 B |
| TestDictionaryLock |     2 |   100 |   100 |      1,343.876 μs |       111.9028 μs |       6.3227 μs |   1.00 |     0.00 |     210.9375 |         - |        - |    1000 B |
|     TestInternLock |     2 |   100 |   100 |      1,459.805 μs |        48.9921 μs |       2.7681 μs |   1.09 |     0.00 |     205.0781 |         - |        - |     440 B |
| TestDictionaryLock |     2 |   100 |   400 |      4,924.229 μs |       328.8836 μs |      18.5825 μs |   1.00 |     0.00 |     820.3125 |         - |        - |    1000 B |
|     TestInternLock |     2 |   100 |   400 |      5,879.851 μs |       509.1625 μs |      28.7686 μs |   1.19 |     0.01 |     820.3125 |         - |        - |     440 B |
| TestDictionaryLock |     2 |   100 |  1000 |     12,511.940 μs |     1,880.2046 μs |     106.2350 μs |   1.00 |     0.00 |    2046.8750 |         - |        - |    1000 B |
|     TestInternLock |     2 |   100 |  1000 |     14,453.271 μs |     2,812.6414 μs |     158.9195 μs |   1.16 |     0.01 |    2046.8750 |         - |        - |     440 B |
| TestDictionaryLock |     2 |   100 | 65535 |    794,836.172 μs |    60,370.8319 μs |   3,411.0640 μs |   1.00 |     0.00 |  133937.5000 |   62.5000 |        - |    1000 B |
|     TestInternLock |     2 |   100 | 65535 |  1,010,072.401 μs |    21,662.6712 μs |   1,223.9811 μs |   1.27 |     0.00 |  133875.0000 |   62.5000 |        - |       0 B |
| TestDictionaryLock |     2 |  1000 |     1 |        406.395 μs |       119.5370 μs |       6.7541 μs |   1.00 |     0.00 |      71.7773 |         - |        - |    1000 B |
|     TestInternLock |     2 |  1000 |     1 |        166.391 μs |         1.0933 μs |       0.0618 μs |   0.41 |     0.01 |      20.5078 |         - |        - |     440 B |
| TestDictionaryLock |     2 |  1000 |    10 |      1,675.098 μs |       302.2105 μs |      17.0755 μs |   1.00 |     0.00 |     275.3906 |    5.8594 |        - |    1000 B |
|     TestInternLock |     2 |  1000 |    10 |      1,499.291 μs |        13.5832 μs |       0.7675 μs |   0.90 |     0.01 |     205.0781 |         - |        - |     440 B |
| TestDictionaryLock |     2 |  1000 |    20 |      2,965.299 μs |       501.9848 μs |      28.3631 μs |   1.00 |     0.00 |     488.2813 |    3.9063 |        - |    1000 B |
|     TestInternLock |     2 |  1000 |    20 |      2,916.796 μs |       232.9405 μs |      13.1616 μs |   0.98 |     0.01 |     410.1563 |         - |        - |     440 B |
| TestDictionaryLock |     2 |  1000 |   100 |     13,152.996 μs |       731.8705 μs |      41.3520 μs |   1.00 |     0.00 |    2125.0000 |   15.6250 |        - |    1000 B |
|     TestInternLock |     2 |  1000 |   100 |     14,103.523 μs |       202.1888 μs |      11.4240 μs |   1.07 |     0.00 |    2046.8750 |         - |        - |     440 B |
| TestDictionaryLock |     2 |  1000 |   400 |     48,244.850 μs |     5,597.4994 μs |     316.2691 μs |   1.00 |     0.00 |    8250.0000 |   62.5000 |        - |    1000 B |
|     TestInternLock |     2 |  1000 |   400 |     56,117.316 μs |     1,265.0680 μs |      71.4787 μs |   1.16 |     0.01 |    8125.0000 |         - |        - |       0 B |
| TestDictionaryLock |     2 |  1000 |  1000 |    118,234.838 μs |    11,485.4707 μs |     648.9504 μs |   1.00 |     0.00 |   20500.0000 |   62.5000 |        - |    1000 B |
|     TestInternLock |     2 |  1000 |  1000 |    140,734.859 μs |    10,177.7363 μs |     575.0610 μs |   1.19 |     0.01 |   20437.5000 |         - |        - |       0 B |
| TestDictionaryLock |     2 |  1000 | 65535 |  7,865,743.167 μs |   699,870.5997 μs |  39,543.9867 μs |   1.00 |     0.00 | 1338875.0000 |  750.0000 |  62.5000 |    1000 B |
|     TestInternLock |     2 |  1000 | 65535 | 10,225,537.578 μs | 2,505,605.3843 μs | 141,571.3507 μs |   1.30 |     0.02 | 1338125.0000 | 1000.0000 |  62.5000 |       0 B |
| TestDictionaryLock |     3 |     1 |     1 |          3.826 μs |         0.5958 μs |       0.0337 μs |   1.00 |     0.00 |       0.3929 |         - |        - |    1056 B |
|     TestInternLock |     3 |     1 |     1 |          2.477 μs |         0.0428 μs |       0.0024 μs |   0.65 |     0.00 |       0.1869 |         - |        - |     496 B |
| TestDictionaryLock |     3 |     1 |    10 |         10.784 μs |         3.8015 μs |       0.2148 μs |   1.00 |     0.00 |       0.6714 |         - |        - |    1056 B |
|     TestInternLock |     3 |     1 |    10 |         10.318 μs |         5.3294 μs |       0.3011 μs |   0.96 |     0.03 |       0.4578 |         - |        - |     496 B |
| TestDictionaryLock |     3 |     1 |    20 |         16.286 μs |        12.6020 μs |       0.7120 μs |   1.00 |     0.00 |       0.9766 |         - |        - |    1056 B |
|     TestInternLock |     3 |     1 |    20 |         18.224 μs |         1.4720 μs |       0.0832 μs |   1.12 |     0.04 |       0.7629 |         - |        - |     496 B |
| TestDictionaryLock |     3 |     1 |   100 |         58.080 μs |        14.0533 μs |       0.7940 μs |   1.00 |     0.00 |       3.4180 |         - |        - |    1057 B |
|     TestInternLock |     3 |     1 |   100 |         62.464 μs |        16.1114 μs |       0.9103 μs |   1.08 |     0.02 |       3.1738 |         - |        - |     496 B |
| TestDictionaryLock |     3 |     1 |   400 |        171.092 μs |        16.5191 μs |       0.9334 μs |   1.00 |     0.00 |      12.4512 |         - |        - |    1080 B |
|     TestInternLock |     3 |     1 |   400 |        174.201 μs |         1.7844 μs |       0.1008 μs |   1.02 |     0.00 |      12.4512 |         - |        - |     520 B |
| TestDictionaryLock |     3 |     1 |  1000 |        344.115 μs |        14.4355 μs |       0.8156 μs |   1.00 |     0.00 |      30.7617 |         - |        - |    1080 B |
|     TestInternLock |     3 |     1 |  1000 |        368.629 μs |        19.1013 μs |       1.0793 μs |   1.07 |     0.00 |      30.7617 |         - |        - |     520 B |
| TestDictionaryLock |     3 |     1 | 65535 |     18,732.725 μs |     2,956.7280 μs |     167.0606 μs |   1.00 |     0.00 |    2000.0000 |         - |        - |    1080 B |
|     TestInternLock |     3 |     1 | 65535 |     22,073.674 μs |     1,567.5754 μs |      88.5709 μs |   1.18 |     0.01 |    2000.0000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |    20 |     1 |         12.343 μs |         6.5384 μs |       0.3694 μs |   1.00 |     0.00 |       1.4343 |         - |        - |    1056 B |
|     TestInternLock |     3 |    20 |     1 |          7.833 μs |         2.1400 μs |       0.1209 μs |   0.64 |     0.02 |       0.7629 |         - |        - |     496 B |
| TestDictionaryLock |     3 |    20 |    10 |         42.105 μs |         4.6051 μs |       0.2602 μs |   1.00 |     0.00 |       6.9580 |         - |        - |    1056 B |
|     TestInternLock |     3 |    20 |    10 |         42.283 μs |         7.2893 μs |       0.4119 μs |   1.00 |     0.01 |       6.2866 |         - |        - |     496 B |
| TestDictionaryLock |     3 |    20 |    20 |         85.754 μs |        12.4378 μs |       0.7028 μs |   1.00 |     0.00 |      13.6719 |         - |        - |    1056 B |
|     TestInternLock |     3 |    20 |    20 |         83.709 μs |         3.5192 μs |       0.1988 μs |   0.98 |     0.01 |      12.4512 |         - |        - |     496 B |
| TestDictionaryLock |     3 |    20 |   100 |        319.979 μs |        73.7067 μs |       4.1646 μs |   1.00 |     0.00 |      62.5000 |         - |        - |    1079 B |
|     TestInternLock |     3 |    20 |   100 |        351.097 μs |        18.0343 μs |       1.0190 μs |   1.10 |     0.01 |      61.5234 |         - |        - |     520 B |
| TestDictionaryLock |     3 |    20 |   400 |      1,246.605 μs |        83.7829 μs |       4.7339 μs |   1.00 |     0.00 |     246.0938 |         - |        - |    1079 B |
|     TestInternLock |     3 |    20 |   400 |      1,354.222 μs |       227.9077 μs |      12.8772 μs |   1.09 |     0.01 |     246.0938 |         - |        - |     520 B |
| TestDictionaryLock |     3 |    20 |  1000 |      3,163.837 μs |       307.6502 μs |      17.3828 μs |   1.00 |     0.00 |     613.2813 |         - |        - |    1080 B |
|     TestInternLock |     3 |    20 |  1000 |      3,432.767 μs |       540.7030 μs |      30.5507 μs |   1.09 |     0.01 |     613.2813 |         - |        - |     520 B |
| TestDictionaryLock |     3 |    20 | 65535 |    203,547.288 μs |    46,269.8623 μs |   2,614.3330 μs |   1.00 |     0.00 |   40187.5000 |         - |        - |    1080 B |
|     TestInternLock |     3 |    20 | 65535 |    216,462.514 μs |    27,927.2543 μs |   1,577.9417 μs |   1.06 |     0.01 |   40125.0000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |   100 |     1 |         79.574 μs |        34.7981 μs |       1.9662 μs |   1.00 |     0.00 |       9.8877 |         - |        - |    1057 B |
|     TestInternLock |     3 |   100 |     1 |         22.301 μs |         5.8857 μs |       0.3326 μs |   0.28 |     0.01 |       3.2349 |         - |        - |     496 B |
| TestDictionaryLock |     3 |   100 |    10 |        221.724 μs |        32.8314 μs |       1.8550 μs |   1.00 |     0.00 |      41.2598 |         - |        - |    1079 B |
|     TestInternLock |     3 |   100 |    10 |        171.009 μs |         7.6900 μs |       0.4345 μs |   0.77 |     0.01 |      30.7617 |         - |        - |     518 B |
| TestDictionaryLock |     3 |   100 |    20 |        329.846 μs |        35.2816 μs |       1.9935 μs |   1.00 |     0.00 |      68.3594 |         - |        - |    1080 B |
|     TestInternLock |     3 |   100 |    20 |        320.620 μs |        20.7327 μs |       1.1714 μs |   0.97 |     0.01 |      61.5234 |         - |        - |     520 B |
| TestDictionaryLock |     3 |   100 |   100 |      1,435.405 μs |       359.0726 μs |      20.2883 μs |   1.00 |     0.00 |     312.5000 |         - |        - |    1080 B |
|     TestInternLock |     3 |   100 |   100 |      1,614.061 μs |       158.8816 μs |       8.9771 μs |   1.12 |     0.01 |     306.6406 |         - |        - |     520 B |
| TestDictionaryLock |     3 |   100 |   400 |      5,631.286 μs |       601.9850 μs |      34.0133 μs |   1.00 |     0.00 |    1234.3750 |         - |        - |    1080 B |
|     TestInternLock |     3 |   100 |   400 |      6,330.513 μs |       752.4854 μs |      42.5168 μs |   1.12 |     0.01 |    1226.5625 |         - |        - |     520 B |
| TestDictionaryLock |     3 |   100 |  1000 |     13,493.835 μs |       250.1702 μs |      14.1351 μs |   1.00 |     0.00 |    3062.5000 |         - |        - |    1080 B |
|     TestInternLock |     3 |   100 |  1000 |     15,472.699 μs |       598.5754 μs |      33.8206 μs |   1.15 |     0.00 |    3062.5000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |   100 | 65535 |    880,641.934 μs |   103,953.0698 μs |   5,873.5412 μs |   1.00 |     0.00 |  201000.0000 |   62.5000 |        - |    1080 B |
|     TestInternLock |     3 |   100 | 65535 |  1,017,444.678 μs |   125,053.0734 μs |   7,065.7305 μs |   1.16 |     0.01 |  200812.5000 |   62.5000 |        - |     520 B |
| TestDictionaryLock |     3 |  1000 |     1 |        668.525 μs |       122.8889 μs |       6.9435 μs |   1.00 |     0.00 |      94.7266 |   25.3906 |        - |    1080 B |
|     TestInternLock |     3 |  1000 |     1 |        169.507 μs |        15.4166 μs |       0.8711 μs |   0.25 |     0.00 |      30.7617 |         - |        - |     519 B |
| TestDictionaryLock |     3 |  1000 |    10 |      1,701.305 μs |       161.1212 μs |       9.1036 μs |   1.00 |     0.00 |     359.3750 |         - |        - |    1080 B |
|     TestInternLock |     3 |  1000 |    10 |      1,528.503 μs |        48.0116 μs |       2.7127 μs |   0.90 |     0.00 |     306.6406 |         - |        - |     520 B |
| TestDictionaryLock |     3 |  1000 |    20 |      3,260.236 μs |       326.0402 μs |      18.4219 μs |   1.00 |     0.00 |     687.5000 |   23.4375 |        - |    1080 B |
|     TestInternLock |     3 |  1000 |    20 |      2,956.878 μs |       309.6972 μs |      17.4985 μs |   0.91 |     0.01 |     613.2813 |         - |        - |     520 B |
| TestDictionaryLock |     3 |  1000 |   100 |     13,464.597 μs |     2,806.1687 μs |     158.5537 μs |   1.00 |     0.00 |    3109.3750 |   46.8750 |        - |    1080 B |
|     TestInternLock |     3 |  1000 |   100 |     14,429.220 μs |       813.1527 μs |      45.9446 μs |   1.07 |     0.01 |    3062.5000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |  1000 |   400 |     51,378.370 μs |     7,584.3233 μs |     428.5283 μs |   1.00 |     0.00 |   12312.5000 |         - |        - |    1080 B |
|     TestInternLock |     3 |  1000 |   400 |     59,284.773 μs |     5,706.0087 μs |     322.4001 μs |   1.15 |     0.01 |   12250.0000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |  1000 |  1000 |    122,127.455 μs |     7,241.1061 μs |     409.1359 μs |   1.00 |     0.00 |   30750.0000 |   62.5000 |        - |    1080 B |
|     TestInternLock |     3 |  1000 |  1000 |    145,677.352 μs |     6,874.9808 μs |     388.4492 μs |   1.19 |     0.00 |   30625.0000 |         - |        - |     520 B |
| TestDictionaryLock |     3 |  1000 | 65535 |  7,843,702.730 μs |   103,855.9596 μs |   5,868.0543 μs |   1.00 |     0.00 | 2010250.0000 |  750.0000 |  62.5000 |    1080 B |
|     TestInternLock |     3 |  1000 | 65535 | 10,940,394.713 μs |   885,134.1962 μs |  50,011.7235 μs |   1.39 |     0.01 | 2008750.0000 | 1062.5000 |  62.5000 |     520 B |
| TestDictionaryLock |     4 |     1 |     1 |          3.828 μs |         0.2287 μs |       0.0129 μs |   1.00 |     0.00 |       0.4272 |         - |        - |    1136 B |
|     TestInternLock |     4 |     1 |     1 |          2.804 μs |         0.6758 μs |       0.0382 μs |   0.73 |     0.01 |       0.2251 |         - |        - |     576 B |
| TestDictionaryLock |     4 |     1 |    10 |         14.186 μs |         4.6463 μs |       0.2625 μs |   1.00 |     0.00 |       0.7935 |         - |        - |    1136 B |
|     TestInternLock |     4 |     1 |    10 |         15.899 μs |        15.2589 μs |       0.8622 μs |   1.12 |     0.05 |       0.5951 |         - |        - |     576 B |
| TestDictionaryLock |     4 |     1 |    20 |         18.533 μs |        13.6733 μs |       0.7726 μs |   1.00 |     0.00 |       1.1902 |         - |        - |    1136 B |
|     TestInternLock |     4 |     1 |    20 |         20.547 μs |         0.9115 μs |       0.0515 μs |   1.11 |     0.04 |       1.0071 |         - |        - |     576 B |
| TestDictionaryLock |     4 |     1 |   100 |         74.334 μs |        10.6750 μs |       0.6032 μs |   1.00 |     0.00 |       4.3945 |         - |        - |    1138 B |
|     TestInternLock |     4 |     1 |   100 |         70.128 μs |         5.0314 μs |       0.2843 μs |   0.94 |     0.01 |       4.2725 |         - |        - |     577 B |
| TestDictionaryLock |     4 |     1 |   400 |        240.260 μs |        49.8561 μs |       2.8170 μs |   1.00 |     0.00 |      16.6016 |         - |        - |    1152 B |
|     TestInternLock |     4 |     1 |   400 |        252.414 μs |        20.7107 μs |       1.1702 μs |   1.05 |     0.01 |      16.1133 |         - |        - |     593 B |
| TestDictionaryLock |     4 |     1 |  1000 |        516.365 μs |       105.7152 μs |       5.9731 μs |   1.00 |     0.00 |      41.0156 |         - |        - |    1160 B |
|     TestInternLock |     4 |     1 |  1000 |        587.819 μs |        79.2338 μs |       4.4769 μs |   1.14 |     0.01 |      41.0156 |         - |        - |     599 B |
| TestDictionaryLock |     4 |     1 | 65535 |     25,496.724 μs |     3,341.2103 μs |     188.7846 μs |   1.00 |     0.00 |    2656.2500 |         - |        - |    1160 B |
|     TestInternLock |     4 |     1 | 65535 |     29,043.761 μs |     3,888.4696 μs |     219.7057 μs |   1.14 |     0.01 |    2687.5000 |         - |        - |     600 B |
| TestDictionaryLock |     4 |    20 |     1 |         19.139 μs |         6.6812 μs |       0.3775 μs |   1.00 |     0.00 |       2.2583 |         - |        - |    1136 B |
|     TestInternLock |     4 |    20 |     1 |         10.693 μs |         2.7275 μs |       0.1541 μs |   0.56 |     0.01 |       1.0071 |         - |        - |     576 B |
| TestDictionaryLock |     4 |    20 |    10 |         56.642 μs |        14.0270 μs |       0.7926 μs |   1.00 |     0.00 |       9.5215 |         - |        - |    1136 B |
|     TestInternLock |     4 |    20 |    10 |         54.711 μs |        16.9146 μs |       0.9557 μs |   0.97 |     0.02 |       8.3618 |         - |        - |     576 B |
| TestDictionaryLock |     4 |    20 |    20 |         94.859 μs |        33.3386 μs |       1.8837 μs |   1.00 |     0.00 |      17.8223 |         - |        - |    1136 B |
|     TestInternLock |     4 |    20 |    20 |         95.662 μs |         6.1981 μs |       0.3502 μs |   1.01 |     0.02 |      16.4795 |         - |        - |     576 B |
| TestDictionaryLock |     4 |    20 |   100 |        350.521 μs |        47.3034 μs |       2.6727 μs |   1.00 |     0.00 |      82.5195 |         - |        - |    1140 B |
|     TestInternLock |     4 |    20 |   100 |        392.427 μs |        89.5791 μs |       5.0614 μs |   1.12 |     0.01 |      82.0313 |         - |        - |     579 B |
| TestDictionaryLock |     4 |    20 |   400 |      1,409.074 μs |       179.3701 μs |      10.1347 μs |   1.00 |     0.00 |     328.1250 |         - |        - |    1142 B |
|     TestInternLock |     4 |    20 |   400 |      1,596.599 μs |       497.1967 μs |      28.0925 μs |   1.13 |     0.02 |     328.1250 |         - |        - |     583 B |
| TestDictionaryLock |     4 |    20 |  1000 |      3,423.306 μs |       292.9852 μs |      16.5542 μs |   1.00 |     0.00 |     820.3125 |         - |        - |    1148 B |
|     TestInternLock |     4 |    20 |  1000 |      3,916.911 μs |       370.7015 μs |      20.9453 μs |   1.14 |     0.01 |     820.3125 |         - |        - |     589 B |
| TestDictionaryLock |     4 |    20 | 65535 |    238,759.656 μs |    28,768.3420 μs |   1,625.4647 μs |   1.00 |     0.00 |   53562.5000 |         - |        - |    1160 B |
|     TestInternLock |     4 |    20 | 65535 |    240,173.044 μs |    36,465.5474 μs |   2,060.3711 μs |   1.01 |     0.01 |   53625.0000 |         - |        - |     600 B |
| TestDictionaryLock |     4 |   100 |     1 |         78.276 μs |        22.6552 μs |       1.2801 μs |   1.00 |     0.00 |      10.6201 |         - |        - |    1136 B |
|     TestInternLock |     4 |   100 |     1 |         32.181 μs |         3.6547 μs |       0.2065 μs |   0.41 |     0.01 |       4.2725 |         - |        - |     576 B |
| TestDictionaryLock |     4 |   100 |    10 |        225.257 μs |       191.3408 μs |      10.8111 μs |   1.00 |     0.00 |      47.3633 |         - |        - |    1138 B |
|     TestInternLock |     4 |   100 |    10 |        200.607 μs |        45.9628 μs |       2.5970 μs |   0.89 |     0.04 |      41.0156 |         - |        - |     579 B |
| TestDictionaryLock |     4 |   100 |    20 |        369.377 μs |        60.6506 μs |       3.4269 μs |   1.00 |     0.00 |      87.8906 |         - |        - |    1139 B |
|     TestInternLock |     4 |   100 |    20 |        381.064 μs |        37.7179 μs |       2.1311 μs |   1.03 |     0.01 |      82.0313 |         - |        - |     579 B |
| TestDictionaryLock |     4 |   100 |   100 |      1,626.447 μs |       270.8847 μs |      15.3055 μs |   1.00 |     0.00 |     416.0156 |         - |        - |    1143 B |
|     TestInternLock |     4 |   100 |   100 |      1,825.194 μs |       164.8632 μs |       9.3151 μs |   1.12 |     0.01 |     410.1563 |         - |        - |     584 B |
| TestDictionaryLock |     4 |   100 |   400 |      6,423.642 μs |     1,366.3611 μs |      77.2019 μs |   1.00 |     0.00 |    1640.6250 |         - |        - |    1155 B |
|     TestInternLock |     4 |   100 |   400 |      7,195.038 μs |       197.2961 μs |      11.1476 μs |   1.12 |     0.01 |    1632.8125 |         - |        - |     594 B |
| TestDictionaryLock |     4 |   100 |  1000 |     15,569.421 μs |     1,998.4125 μs |     112.9140 μs |   1.00 |     0.00 |    4093.7500 |         - |        - |    1160 B |
|     TestInternLock |     4 |   100 |  1000 |     17,788.066 μs |     4,271.0214 μs |     241.3206 μs |   1.14 |     0.01 |    4062.5000 |         - |        - |     600 B |
| TestDictionaryLock |     4 |   100 | 65535 |    941,035.109 μs |   259,060.1250 μs |  14,637.3775 μs |   1.00 |     0.00 |  268000.0000 |   62.5000 |        - |    1160 B |
|     TestInternLock |     4 |   100 | 65535 |  1,152,240.628 μs |   117,944.3686 μs |   6,664.0755 μs |   1.22 |     0.02 |  268062.5000 |   62.5000 |        - |     600 B |
| TestDictionaryLock |     4 |  1000 |     1 |        493.545 μs |       102.6206 μs |       5.7983 μs |   1.00 |     0.00 |      92.7734 |    0.9766 |        - |    1138 B |
|     TestInternLock |     4 |  1000 |     1 |        193.597 μs |        16.8056 μs |       0.9495 μs |   0.39 |     0.00 |      41.0156 |         - |        - |     579 B |
| TestDictionaryLock |     4 |  1000 |    10 |      2,307.665 μs |       892.9196 μs |      50.4516 μs |   1.00 |     0.00 |     484.3750 |    7.8125 |        - |    1159 B |
|     TestInternLock |     4 |  1000 |    10 |      1,728.215 μs |       401.3004 μs |      22.6742 μs |   0.75 |     0.02 |     408.2031 |         - |        - |     592 B |
| TestDictionaryLock |     4 |  1000 |    20 |      3,404.428 μs |       291.4690 μs |      16.4685 μs |   1.00 |     0.00 |     898.4375 |    3.9063 |        - |    1155 B |
|     TestInternLock |     4 |  1000 |    20 |      3,333.666 μs |       120.5743 μs |       6.8127 μs |   0.98 |     0.00 |     816.4063 |         - |        - |     597 B |
| TestDictionaryLock |     4 |  1000 |   100 |     14,845.883 μs |     3,171.4425 μs |     179.1924 μs |   1.00 |     0.00 |    4156.2500 |   15.6250 |        - |    1160 B |
|     TestInternLock |     4 |  1000 |   100 |     16,297.478 μs |     6,836.3399 μs |     386.2659 μs |   1.10 |     0.02 |    4093.7500 |         - |        - |     600 B |
| TestDictionaryLock |     4 |  1000 |   400 |     54,324.642 μs |     8,321.1914 μs |     470.1627 μs |   1.00 |     0.00 |   16437.5000 |   62.5000 |        - |    1160 B |
|     TestInternLock |     4 |  1000 |   400 |     65,581.893 μs |     4,781.0757 μs |     270.1396 μs |   1.21 |     0.01 |   16312.5000 |         - |        - |     600 B |
| TestDictionaryLock |     4 |  1000 |  1000 |    133,144.467 μs |    12,437.8217 μs |     702.7600 μs |   1.00 |     0.00 |   40937.5000 |         - |        - |    1160 B |
|     TestInternLock |     4 |  1000 |  1000 |    169,070.284 μs |    17,012.3254 μs |     961.2279 μs |   1.27 |     0.01 |   40875.0000 |         - |        - |     600 B |
| TestDictionaryLock |     4 |  1000 | 65535 |  8,350,871.267 μs |   324,082.5072 μs |  18,311.2626 μs |   1.00 |     0.00 | 2680562.5000 |  812.5000 |  62.5000 |    1160 B |
|     TestInternLock |     4 |  1000 | 65535 | 11,327,458.539 μs |   647,684.4732 μs |  36,595.3738 μs |   1.36 |     0.00 | 2681187.5000 | 1125.0000 |  62.5000 |     600 B |
| TestDictionaryLock |     5 |     1 |     1 |          4.233 μs |         0.2739 μs |       0.0155 μs |   1.00 |     0.00 |       0.4654 |         - |        - |    1216 B |
|     TestInternLock |     5 |     1 |     1 |          3.201 μs |         0.7275 μs |       0.0411 μs |   0.76 |     0.01 |       0.2594 |         - |        - |     656 B |
| TestDictionaryLock |     5 |     1 |    10 |         16.866 μs |         3.7944 μs |       0.2144 μs |   1.00 |     0.00 |       0.9155 |         - |        - |    1216 B |
|     TestInternLock |     5 |     1 |    10 |         17.398 μs |         4.8043 μs |       0.2715 μs |   1.03 |     0.02 |       0.7019 |         - |        - |     656 B |
| TestDictionaryLock |     5 |     1 |    20 |         22.518 μs |         0.8401 μs |       0.0475 μs |   1.00 |     0.00 |       1.4343 |         - |        - |    1216 B |
|     TestInternLock |     5 |     1 |    20 |         24.251 μs |         1.9021 μs |       0.1075 μs |   1.08 |     0.00 |       1.2207 |         - |        - |     656 B |
| TestDictionaryLock |     5 |     1 |   100 |         89.886 μs |        23.4373 μs |       1.3242 μs |   1.00 |     0.00 |       5.4932 |         - |        - |    1217 B |
|     TestInternLock |     5 |     1 |   100 |         89.790 μs |         7.2754 μs |       0.4111 μs |   1.00 |     0.01 |       5.2490 |         - |        - |     657 B |
| TestDictionaryLock |     5 |     1 |   400 |        304.823 μs |       300.5425 μs |      16.9812 μs |   1.00 |     0.00 |      20.5078 |         - |        - |    1237 B |
|     TestInternLock |     5 |     1 |   400 |        303.577 μs |        22.2818 μs |       1.2590 μs |   1.00 |     0.04 |      20.5078 |         - |        - |     676 B |
| TestDictionaryLock |     5 |     1 |  1000 |        669.440 μs |        49.3563 μs |       2.7887 μs |   1.00 |     0.00 |      50.7813 |         - |        - |    1240 B |
|     TestInternLock |     5 |     1 |  1000 |        643.279 μs |        91.3993 μs |       5.1642 μs |   0.96 |     0.01 |      50.7813 |         - |        - |     680 B |
| TestDictionaryLock |     5 |     1 | 65535 |     31,999.028 μs |     3,708.5070 μs |     209.5375 μs |   1.00 |     0.00 |    3312.5000 |         - |        - |    1240 B |
|     TestInternLock |     5 |     1 | 65535 |     36,797.121 μs |     2,099.8048 μs |     118.6429 μs |   1.15 |     0.01 |    3312.5000 |         - |        - |     680 B |
| TestDictionaryLock |     5 |    20 |     1 |         23.291 μs |         3.2907 μs |       0.1859 μs |   1.00 |     0.00 |       2.4719 |         - |        - |    1216 B |
|     TestInternLock |     5 |    20 |     1 |         16.094 μs |         3.1410 μs |       0.1775 μs |   0.69 |     0.01 |       1.2207 |         - |        - |     656 B |
| TestDictionaryLock |     5 |    20 |    10 |         70.509 μs |        10.8240 μs |       0.6116 μs |   1.00 |     0.00 |      11.1084 |         - |        - |    1216 B |
|     TestInternLock |     5 |    20 |    10 |         73.535 μs |        12.6841 μs |       0.7167 μs |   1.04 |     0.01 |      10.3760 |         - |        - |     656 B |
| TestDictionaryLock |     5 |    20 |    20 |        142.549 μs |        13.9661 μs |       0.7891 μs |   1.00 |     0.00 |      21.2402 |         - |        - |    1216 B |
|     TestInternLock |     5 |    20 |    20 |        155.556 μs |        40.9999 μs |       2.3166 μs |   1.09 |     0.01 |      20.5078 |         - |        - |     656 B |
| TestDictionaryLock |     5 |    20 |   100 |        558.397 μs |        13.5563 μs |       0.7660 μs |   1.00 |     0.00 |     103.5156 |         - |        - |    1240 B |
|     TestInternLock |     5 |    20 |   100 |        637.663 μs |        93.2450 μs |       5.2685 μs |   1.14 |     0.01 |     102.5391 |         - |        - |     680 B |
| TestDictionaryLock |     5 |    20 |   400 |      2,082.236 μs |        75.7745 μs |       4.2814 μs |   1.00 |     0.00 |     410.1563 |         - |        - |    1240 B |
|     TestInternLock |     5 |    20 |   400 |      2,496.689 μs |       162.4970 μs |       9.1814 μs |   1.20 |     0.00 |     410.1563 |         - |        - |     680 B |
| TestDictionaryLock |     5 |    20 |  1000 |      5,426.040 μs |     1,087.1525 μs |      61.4261 μs |   1.00 |     0.00 |    1023.4375 |         - |        - |    1240 B |
|     TestInternLock |     5 |    20 |  1000 |      6,079.474 μs |     1,538.7171 μs |      86.9404 μs |   1.12 |     0.02 |    1023.4375 |         - |        - |     680 B |
| TestDictionaryLock |     5 |    20 | 65535 |    320,909.368 μs |    65,781.0263 μs |   3,716.7500 μs |   1.00 |     0.00 |   67000.0000 |         - |        - |    1240 B |
|     TestInternLock |     5 |    20 | 65535 |    331,542.014 μs |   142,861.3624 μs |   8,071.9319 μs |   1.03 |     0.02 |   67000.0000 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 |     1 |         98.746 μs |        70.8854 μs |       4.0052 μs |   1.00 |     0.00 |      12.2070 |         - |        - |    1216 B |
|     TestInternLock |     5 |   100 |     1 |         41.880 μs |         5.3844 μs |       0.3042 μs |   0.42 |     0.01 |       5.3101 |         - |        - |     656 B |
| TestDictionaryLock |     5 |   100 |    10 |        352.502 μs |        56.1675 μs |       3.1736 μs |   1.00 |     0.00 |      58.1055 |         - |        - |    1240 B |
|     TestInternLock |     5 |   100 |    10 |        325.315 μs |        33.5247 μs |       1.8942 μs |   0.92 |     0.01 |      51.2695 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 |    20 |        539.676 μs |        60.5639 μs |       3.4220 μs |   1.00 |     0.00 |     108.3984 |         - |        - |    1240 B |
|     TestInternLock |     5 |   100 |    20 |        594.649 μs |        40.6443 μs |       2.2965 μs |   1.10 |     0.01 |     102.5391 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 |   100 |      2,515.444 μs |       272.4783 μs |      15.3955 μs |   1.00 |     0.00 |     515.6250 |         - |        - |    1240 B |
|     TestInternLock |     5 |   100 |   100 |      2,898.137 μs |       267.7420 μs |      15.1279 μs |   1.15 |     0.01 |     511.7188 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 |   400 |      9,694.180 μs |     2,678.4849 μs |     151.3394 μs |   1.00 |     0.00 |    2046.8750 |         - |        - |    1240 B |
|     TestInternLock |     5 |   100 |   400 |     11,141.727 μs |     6,750.7838 μs |     381.4318 μs |   1.15 |     0.04 |    2046.8750 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 |  1000 |     23,627.873 μs |     6,536.9976 μs |     369.3525 μs |   1.00 |     0.00 |    5125.0000 |         - |        - |    1240 B |
|     TestInternLock |     5 |   100 |  1000 |     29,150.838 μs |    10,015.9035 μs |     565.9171 μs |   1.23 |     0.03 |    5093.7500 |         - |        - |     680 B |
| TestDictionaryLock |     5 |   100 | 65535 |  1,298,411.959 μs |   231,146.3480 μs |  13,060.1973 μs |   1.00 |     0.00 |  335062.5000 |  125.0000 |        - |    1240 B |
|     TestInternLock |     5 |   100 | 65535 |  1,549,927.508 μs |   350,124.5858 μs |  19,782.6884 μs |   1.19 |     0.02 |  334875.0000 |  125.0000 |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |     1 |        696.251 μs |       158.2827 μs |       8.9433 μs |   1.00 |     0.00 |     104.4922 |   30.2734 |        - |    1240 B |
|     TestInternLock |     5 |  1000 |     1 |        321.933 μs |        14.9073 μs |       0.8423 μs |   0.46 |     0.00 |      51.2695 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |    10 |      2,979.770 μs |       454.0742 μs |      25.6560 μs |   1.00 |     0.00 |     582.0313 |   11.7188 |        - |    1240 B |
|     TestInternLock |     5 |  1000 |    10 |      2,788.646 μs |       106.2873 μs |       6.0054 μs |   0.94 |     0.01 |     511.7188 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |    20 |      5,403.515 μs |     1,023.9239 μs |      57.8536 μs |   1.00 |     0.00 |    1085.9375 |   46.8750 |        - |    1240 B |
|     TestInternLock |     5 |  1000 |    20 |      5,352.598 μs |     1,735.9647 μs |      98.0852 μs |   0.99 |     0.02 |    1023.4375 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |   100 |     24,056.787 μs |     8,717.5466 μs |     492.5575 μs |   1.00 |     0.00 |    5187.5000 |   31.2500 |        - |    1240 B |
|     TestInternLock |     5 |  1000 |   100 |     27,027.223 μs |     5,926.2747 μs |     334.8455 μs |   1.12 |     0.02 |    5093.7500 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |   400 |     84,310.525 μs |    21,996.9847 μs |   1,242.8704 μs |   1.00 |     0.00 |   20437.5000 |         - |        - |    1240 B |
|     TestInternLock |     5 |  1000 |   400 |     99,007.300 μs |    55,677.1602 μs |   3,145.8628 μs |   1.17 |     0.03 |   20437.5000 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 |  1000 |    186,661.754 μs |    21,102.7515 μs |   1,192.3446 μs |   1.00 |     0.00 |   51187.5000 |   62.5000 |        - |    1240 B |
|     TestInternLock |     5 |  1000 |  1000 |    242,331.021 μs |   137,141.8155 μs |   7,748.7669 μs |   1.30 |     0.03 |   51125.0000 |         - |        - |     680 B |
| TestDictionaryLock |     5 |  1000 | 65535 | 11,297,539.125 μs | 1,364,219.0098 μs |  77,080.9039 μs |   1.00 |     0.00 | 3350312.5000 | 1125.0000 |  62.5000 |    1240 B |
|     TestInternLock |     5 |  1000 | 65535 | 16,520,813.417 μs | 2,434,316.4983 μs | 137,543.3964 μs |   1.46 |     0.01 | 3351312.5000 | 1625.0000 | 125.0000 |     680 B |
| TestDictionaryLock |     6 |     1 |     1 |          4.670 μs |         1.3697 μs |       0.0774 μs |   1.00 |     0.00 |       0.4959 |         - |        - |    1296 B |
|     TestInternLock |     6 |     1 |     1 |          3.722 μs |         0.1192 μs |       0.0067 μs |   0.80 |     0.01 |       0.2899 |         - |        - |     736 B |
| TestDictionaryLock |     6 |     1 |    10 |         18.947 μs |         1.3430 μs |       0.0759 μs |   1.00 |     0.00 |       1.0376 |         - |        - |    1296 B |
|     TestInternLock |     6 |     1 |    10 |         15.072 μs |         8.5958 μs |       0.4857 μs |   0.80 |     0.02 |       0.8240 |         - |        - |     736 B |
| TestDictionaryLock |     6 |     1 |    20 |         27.310 μs |         7.0977 μs |       0.4010 μs |   1.00 |     0.00 |       1.6785 |         - |        - |    1296 B |
|     TestInternLock |     6 |     1 |    20 |         28.384 μs |         2.2066 μs |       0.1247 μs |   1.04 |     0.01 |       1.4648 |         - |        - |     736 B |
| TestDictionaryLock |     6 |     1 |   100 |        108.401 μs |        16.3176 μs |       0.9220 μs |   1.00 |     0.00 |       6.5918 |         - |        - |    1297 B |
|     TestInternLock |     6 |     1 |   100 |        116.215 μs |         9.8740 μs |       0.5579 μs |   1.07 |     0.01 |       6.3477 |         - |        - |     737 B |
| TestDictionaryLock |     6 |     1 |   400 |        345.170 μs |       167.8097 μs |       9.4816 μs |   1.00 |     0.00 |      24.9023 |         - |        - |    1316 B |
|     TestInternLock |     6 |     1 |   400 |        348.342 μs |       125.8042 μs |       7.1082 μs |   1.01 |     0.03 |      24.4141 |         - |        - |     752 B |
| TestDictionaryLock |     6 |     1 |  1000 |        823.853 μs |       253.9052 μs |      14.3461 μs |   1.00 |     0.00 |      61.5234 |         - |        - |    1320 B |
|     TestInternLock |     6 |     1 |  1000 |        780.323 μs |        85.0360 μs |       4.8047 μs |   0.95 |     0.01 |      61.5234 |         - |        - |     760 B |
| TestDictionaryLock |     6 |     1 | 65535 |     38,816.688 μs |     1,618.6084 μs |      91.4544 μs |   1.00 |     0.00 |    4000.0000 |         - |        - |    1320 B |
|     TestInternLock |     6 |     1 | 65535 |     46,202.305 μs |     8,154.2937 μs |     460.7327 μs |   1.19 |     0.01 |    4000.0000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |    20 |     1 |         18.062 μs |        13.5887 μs |       0.7678 μs |   1.00 |     0.00 |       2.1362 |         - |        - |    1296 B |
|     TestInternLock |     6 |    20 |     1 |         16.542 μs |         3.1981 μs |       0.1807 μs |   0.92 |     0.03 |       1.4648 |         - |        - |     736 B |
| TestDictionaryLock |     6 |    20 |    10 |         72.308 μs |         7.7620 μs |       0.4386 μs |   1.00 |     0.00 |      13.1836 |         - |        - |    1296 B |
|     TestInternLock |     6 |    20 |    10 |         85.129 μs |        45.8313 μs |       2.5896 μs |   1.18 |     0.03 |      12.4512 |         - |        - |     736 B |
| TestDictionaryLock |     6 |    20 |    20 |        159.646 μs |        24.8348 μs |       1.4032 μs |   1.00 |     0.00 |      25.8789 |         - |        - |    1296 B |
|     TestInternLock |     6 |    20 |    20 |        163.904 μs |        36.4644 μs |       2.0603 μs |   1.03 |     0.01 |      24.6582 |         - |        - |     737 B |
| TestDictionaryLock |     6 |    20 |   100 |        594.008 μs |        67.4482 μs |       3.8110 μs |   1.00 |     0.00 |     123.0469 |         - |        - |    1319 B |
|     TestInternLock |     6 |    20 |   100 |        702.172 μs |       222.1953 μs |      12.5544 μs |   1.18 |     0.02 |     123.0469 |         - |        - |     759 B |
| TestDictionaryLock |     6 |    20 |   400 |      2,380.834 μs |       263.4463 μs |      14.8852 μs |   1.00 |     0.00 |     492.1875 |         - |        - |    1320 B |
|     TestInternLock |     6 |    20 |   400 |      2,661.568 μs |       104.6614 μs |       5.9136 μs |   1.12 |     0.01 |     492.1875 |         - |        - |     760 B |
| TestDictionaryLock |     6 |    20 |  1000 |      6,167.612 μs |       901.3007 μs |      50.9252 μs |   1.00 |     0.00 |    1226.5625 |         - |        - |    1320 B |
|     TestInternLock |     6 |    20 |  1000 |      6,751.208 μs |       205.2103 μs |      11.5948 μs |   1.09 |     0.01 |    1226.5625 |         - |        - |     760 B |
| TestDictionaryLock |     6 |    20 | 65535 |    421,834.107 μs |   108,650.7437 μs |   6,138.9685 μs |   1.00 |     0.00 |   80375.0000 |         - |        - |    1320 B |
|     TestInternLock |     6 |    20 | 65535 |    448,193.160 μs |    88,157.2395 μs |   4,981.0475 μs |   1.06 |     0.02 |   80375.0000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |   100 |     1 |         80.081 μs |        25.9843 μs |       1.4682 μs |   1.00 |     0.00 |      12.6953 |         - |        - |    1296 B |
|     TestInternLock |     6 |   100 |     1 |         52.145 μs |         2.9474 μs |       0.1665 μs |   0.65 |     0.01 |       6.3477 |         - |        - |     736 B |
| TestDictionaryLock |     6 |   100 |    10 |        355.199 μs |        66.5682 μs |       3.7612 μs |   1.00 |     0.00 |      65.9180 |         - |        - |    1318 B |
|     TestInternLock |     6 |   100 |    10 |        345.120 μs |        48.7614 μs |       2.7551 μs |   0.97 |     0.01 |      61.5234 |         - |        - |     758 B |
| TestDictionaryLock |     6 |   100 |    20 |        598.283 μs |       272.1788 μs |      15.3786 μs |   1.00 |     0.00 |     128.9063 |         - |        - |    1319 B |
|     TestInternLock |     6 |   100 |    20 |        638.452 μs |        47.5469 μs |       2.6865 μs |   1.07 |     0.02 |     123.0469 |         - |        - |     759 B |
| TestDictionaryLock |     6 |   100 |   100 |      2,801.957 μs |       825.7585 μs |      46.6569 μs |   1.00 |     0.00 |     621.0938 |         - |        - |    1320 B |
|     TestInternLock |     6 |   100 |   100 |      3,114.667 μs |       353.3775 μs |      19.9665 μs |   1.11 |     0.02 |     613.2813 |         - |        - |     760 B |
| TestDictionaryLock |     6 |   100 |   400 |     10,949.222 μs |     2,327.4351 μs |     131.5044 μs |   1.00 |     0.00 |    2453.1250 |         - |        - |    1320 B |
|     TestInternLock |     6 |   100 |   400 |     12,834.949 μs |       521.9017 μs |      29.4884 μs |   1.17 |     0.01 |    2453.1250 |         - |        - |     760 B |
| TestDictionaryLock |     6 |   100 |  1000 |     26,909.880 μs |     1,679.3608 μs |      94.8870 μs |   1.00 |     0.00 |    6125.0000 |         - |        - |    1320 B |
|     TestInternLock |     6 |   100 |  1000 |     31,234.511 μs |       521.7034 μs |      29.4772 μs |   1.16 |     0.00 |    6125.0000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |   100 | 65535 |  1,810,533.675 μs |   308,176.5546 μs |  17,412.5468 μs |   1.00 |     0.00 |  401937.5000 |  125.0000 |        - |    1320 B |
|     TestInternLock |     6 |   100 | 65535 |  2,145,345.421 μs |   142,627.2150 μs |   8,058.7021 μs |   1.18 |     0.01 |  401875.0000 |  187.5000 |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |     1 |        783.422 μs |       629.9049 μs |      35.5908 μs |   1.00 |     0.00 |     139.6484 |    2.9297 |        - |    1318 B |
|     TestInternLock |     6 |  1000 |     1 |        328.274 μs |        12.4438 μs |       0.7031 μs |   0.42 |     0.02 |      61.5234 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |    10 |      3,140.713 μs |       865.9537 μs |      48.9280 μs |   1.00 |     0.00 |     691.4063 |    7.8125 |        - |    1320 B |
|     TestInternLock |     6 |  1000 |    10 |      2,924.569 μs |       118.6272 μs |       6.7027 μs |   0.93 |     0.01 |     613.2813 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |    20 |      5,671.544 μs |       572.7923 μs |      32.3638 μs |   1.00 |     0.00 |    1281.2500 |  132.8125 |        - |    1320 B |
|     TestInternLock |     6 |  1000 |    20 |      5,830.652 μs |       287.4582 μs |      16.2419 μs |   1.03 |     0.01 |    1226.5625 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |   100 |     25,576.689 μs |     2,122.6916 μs |     119.9360 μs |   1.00 |     0.00 |    6187.5000 |   31.2500 |        - |    1320 B |
|     TestInternLock |     6 |  1000 |   100 |     29,063.399 μs |     2,242.1391 μs |     126.6850 μs |   1.14 |     0.01 |    6125.0000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |   400 |     99,306.942 μs |    15,567.7699 μs |     879.6079 μs |   1.00 |     0.00 |   24562.5000 |   62.5000 |        - |    1320 B |
|     TestInternLock |     6 |  1000 |   400 |    119,775.126 μs |    16,245.8728 μs |     917.9219 μs |   1.21 |     0.01 |   24500.0000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 |  1000 |    246,879.992 μs |    41,931.4072 μs |   2,369.2023 μs |   1.00 |     0.00 |   61375.0000 |   62.5000 |        - |    1320 B |
|     TestInternLock |     6 |  1000 |  1000 |    317,117.936 μs |    23,737.4305 μs |   1,341.2088 μs |   1.28 |     0.01 |   61312.5000 |         - |        - |     760 B |
| TestDictionaryLock |     6 |  1000 | 65535 | 13,572,561.658 μs | 1,295,093.1719 μs |  73,175.1659 μs |   1.00 |     0.00 | 4020187.5000 | 1312.5000 | 125.0000 |    1320 B |
|     TestInternLock |     6 |  1000 | 65535 | 19,568,632.313 μs | 2,846,129.3880 μs | 160,811.5884 μs |   1.44 |     0.01 | 4021187.5000 | 1937.5000 | 187.5000 |     760 B |

##### Code

```csharp
public class TestBench
{
	[Params(1, 2, 3, 4, 5, 6)]
	public int Tasks { get; set; }

	[Params(1, 20, 100, 1000)]
	public int Locks { get; set; }

	[Params(1, 10, 20, 100, 400, 1000, ushort.MaxValue)]
	public int Loops { get; set; }

	[Benchmark(Baseline = true)]
	public void TestDictionaryLock()
	{
		var tester = new DictionaryLock();
		var tasks = new Task[Tasks];
		for (var i = 0; i < Tasks; i++)
		{
			tasks[i] = Task.Run(() => TestImpl(tester));
		}
		Task.WaitAll(tasks);
	}

	[Benchmark]
	public void TestInternLock()
	{
		var tester = new InternLock();
		var tasks = new Task[Tasks];
		for (var i = 0; i < Tasks; i++)
		{
			tasks[i] = Task.Run(() => TestImpl(tester));
		}
		Task.WaitAll(tasks);
	}

	void TestImpl(ILockTester tester)
	{
		var cnt = 0;
		for (var loop = 0; loop < Loops; loop++)
		{
			for (var @lock = 0; @lock < Locks; @lock++)
			{
				cnt += tester.DoSomething(@lock.ToString());
			}
		}
	}
}

interface ILockTester
{
	int DoSomething(string name);
}

class DictionaryLock : ILockTester
{
	ConcurrentDictionary<string, object> _locks;

	public DictionaryLock()
	{
		_locks = new ConcurrentDictionary<string, object>();
	}

	public int DoSomething(string name)
	{
		var locker = _locks.GetOrAdd(name, _ => new object());
		lock (locker)
		{
			return 1;
		}
	}
}

class InternLock : ILockTester
{
	public int DoSomething(string name)
	{
		var locker = string.Intern(name);
		lock (locker)
		{
			return 1;
		}
	}
}
```

[1]: {{ include "post_link" 233703 }}