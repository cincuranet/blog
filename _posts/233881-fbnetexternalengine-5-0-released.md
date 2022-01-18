---
title: |-
  FbNetExternalEngine 5.0 released
date: 2022-01-18T09:24:00Z
tags:
  - Firebird
  - .NET
---
Big step forward for [_FbNetExternalEngine_][1] today. Version 5.0 is ready, you can go and download it right now and it contains some major improvements.

<!-- excerpt -->

The first big change is update of runtime to .NET 6. Hence you can use all the latest and greatest features and also benefit from numerous performance improvements there. Speaking of performance... That's the other big change. I've spent a lot of time optimizing the code paths, allocations and even number of methods calls or number of parameters. All this resulted in about 9% speed increase (and lower memory consumption), which I'm very happy about. An _empty_ function call is now, on my machine, about 1.1 μs. Also some internal changes opened options for future improvements. 

Sadly, one feature had to go. The _hot reload_ via `net$clean` (or previously `net$update`). This feature was fragile, difficult to maintain and fit into performance oriented code. Also, I believe the feature was trying to solve problem that should really be solved at another level.

As usual check the [docs page][1] as well as the _examples_ directory in the [downloaded package][2].

[1]: https://www.fbnetexternalengine.com
[2]: https://portal.fbnetexternalengine.com/Download
