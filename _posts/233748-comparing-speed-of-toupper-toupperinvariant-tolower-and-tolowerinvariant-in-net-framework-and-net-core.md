---
title: |-
  Comparing speed of ToUpper, ToUpperInvariant, ToLower and ToLowerInvariant in .NET Framework and .NET Core
date: 2018-10-23T10:17:00Z
tags:
  - .NET
  - .NET Core
  - JIT
  - RyuJIT
---
While I was reviewing some code week or two back, I got idea to test what's the speed difference between `ToUpper`, `ToUpperInvariant`, `ToLower` and `ToLowerInvariant`. Of course, these methods are not doing the same thing, but sometimes it doesn't really matter and if any is sufficient then, maybe, performance wins. Or at least I thought it's going to be interesting to see whether there's a difference and how much.

<!-- excerpt -->

#### Setup

Obviously, the problem is that the outcome is very likely dependent on the string being processed and unless I want to test all possible combinations I have to choose some subset. My first, self-imposed, constraint was to consider only strings containing `A` to `Z`, `a` to `z` and `0` to `9`, basically only letters and numbers from ASCII. Once you start mixing in national characters it's really a different game and this comparison starts to fall apart. From these characters I made strings of length between 1 to 10 and then 100 and 255. I made bunch of permutations from these and used the trusty [BenchmarkDotNet][2] to execute it multiple times to get even more data averaging all the results at the end (one run took almost 3 hours). Thus for i.e. strings of length 1 I ended up testing these: `6`, `8`, `E`, `f`, `H`, `I`, `P`, `Q`, `r`, `U`.

The CPU was Intel Xeon E5-2673 v3 2.40GHz. The .NET Framework used was `.NET Framework 4.7.2 (CLR 4.0.30319.42000), 64bit RyuJIT-v4.7.3163.0` and .NET Core was `.NET Core 2.1.4 (CoreCLR 4.6.26814.03, CoreFX 4.6.26814.02), 64bit RyuJIT`. All times are in `ns`.

#### Numbers

Let's first talk about regular .NET Framework.

|     | ToLower | ToLowerInvariant | ToUpper | ToUpperInvariant |
|-----|--------:|-----------------:|--------:|-----------------:|
| 1   | 121,821 |           78,557 |  79,566 |           79,983 |
| 2   | 125,223 |           81,275 |  82,549 |           82,751 |
| 3   | 126,422 |           83,580 |  85,302 |           86,042 |
| 4   | 129,046 |           86,878 |  89,030 |           88,969 |
| 5   | 131,579 |           90,169 |  91,681 |           91,847 |
| 6   | 134,335 |           92,991 |  94,046 |           94,389 |
| 7   | 136,308 |           95,596 |  96,728 |           97,531 |
| 8   | 140,079 |           98,496 |  99,832 |          100,498 |
| 9   | 143,711 |          102,215 | 102,904 |          102,866 |
| 10  | 147,154 |          104,303 | 105,456 |          105,646 |
| 100 | 420,101 |          373,882 | 373,715 |          374,270 |
| 255 | 867,178 |          816,733 | 818,960 |          818,539 |

Clearly the `ToLower` is slowest. The other three are mostly the same. But in general, `ToLowerInvariant` is fastest, then `ToUpper` and then `ToUpperInvariant`.

Surprisingly, the .NET Core is roughly 2,6× faster across the results.

|     | ToLower | ToLowerInvariant | ToUpper | ToUpperInvariant |
|-----|--------:|-----------------:|--------:|-----------------:|
| 1   |  46,337 |           29,144 |  25,825 |           25,827 |
| 2   |  48,319 |           33,005 |  32,178 |           32,254 |
| 3   |  48,521 |           33,319 |  35,515 |           35,391 |
| 4   |  55,158 |           38,244 |  37,282 |           36,977 |
| 5   |  55,721 |           40,372 |  40,028 |           39,932 |
| 6   |  56,587 |           40,790 |  43,153 |           42,883 |
| 7   |  59,739 |           42,180 |  40,165 |           40,204 |
| 8   |  64,512 |           46,196 |  43,814 |           44,070 |
| 9   |  65,980 |           47,958 |  43,545 |           43,631 |
| 10  |  63,752 |           46,374 |  49,083 |           49,179 |
| 100 | 212,262 |          193,184 | 198,214 |          198,144 |
| 255 | 486,015 |          463,655 | 469,989 |          468,428 |

I was not expecting that. The `ToLower` is still slowest and then the remaining methods. Compared to .NET Framework the pattern on remaining three is not consistent. But if you'd ask me, I would order it `ToUpper` fastest, then `ToUpperInvariant` and then `ToLowerInvariant`.

The memory allocations seem to be same for both .NET Framework and .NET Core for all methods for given string lengths.

#### Summary

I remember reading quite some years ago, I think it was in [Jeffrey Richter's book CLR via C#][1], that `ToUpper` is faster than its lowercase counterpart and should be used whenever possible. And based on the numbers here he was/is right. The invariant versions are not that different, but I don't see a reason to not stick with uppercase versions. For the sake of consistency.

Now I have the temptation to explore where does the speed difference come from (but I have a feeling I would burn a lot of time exploring that). Or, if you know, teach me in the comments.

[1]: https://www.amazon.com/CLR-via-C-Developer-Reference-ebook-dp-B00JDMQJKQ/dp/B00JDMQJKQ/ref=mt_kindle?_encoding=UTF8&me=&qid=
[2]: https://benchmarkdotnet.org/