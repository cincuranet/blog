---
title: |-
  FbNetExternalEngine performance numbers
date: 2017-07-24T12:04:00Z
tags:
  - Firebird
  - .NET
---
Over the last few days I was working on performance of _FbNetExternalEngine_. Basically doing all I can to make it execute the code quickly as possible. OK, maybe not all I can, but something that gives biggest gain while being able to program it in a reasonable timeframe, because there's always room for more.

<!-- excerpt -->

First I needed something to benchmark against. Currently only procedures are supported in _FbNetExternalEngine_, so something similar to this kind of execution. There isn't much to think about: PSQL procedures. Because I'm interested about the execution speed, not the code speed inside the procedure, I'm benchmarking empty procedures. To eliminate any network etc. slowdowns I'm doing a simple loop in `execute block`, that way I know everything is running completely on server. I took 100000 iterations to get some numbers one can measure. And as usual, it's running on my machine (Firebird 3.0.2 x64, Intel Core i5-7500) hence the actual numbers are not that important for you probably, rather the comparison is. 

Looping with empty PSQL procedure took `0,21 s`. That's the baseline.

Because I wanted to know where some time is lost and where I can and should put my focus, I started iteratively adding more logic. Starting with empty plugin. With that I'm hovering around `0,27 s`. This is really the bare metal plugin (unmanaged code only), just a few lines of code to make Firebird happy.

Next was trivial to jump to .NET/CLR without any logic whatsoever. This time it's `0,34 s`. It's slowly building up. To actually return something a minimum allocation needs to be done in managed code. With that in place, `0,38 s` is the number.

After this I started adding some classes and logic, but that was fairly boring, so I'll jump to the final results. The execution of the procedure is heavily relying on reflection and as everybody knows, reflection is slow (at least compared to regular "direct" invocation). Thus, I'm caching as much reflection information as I can. The very first execution is slow, but once the cache is populated, it runs quick(er). 

With all that in place the time required to run 100000 the .NET procedure is `1,3 s`. That's a big jump. But all the previous pieces were just some hardcoded dummy or empty code. Now it's finally doing something.

Maybe you remember from [previous post][1] that to support "live" updates of the assembly with procedures my plan was to use _AppDomains_. Although it was interesting to do it, it was a performance killer. All the cross-domain stuff was about 3 orders of magnitude slower than a single domain execution. Thus I decided to abandon _AppDomains_ and find a different way to achieve the "live" updates (more about that in [next post][2]). 

With all numbers in hand, let's do some math. The execution of .NET procedure is, with current version of the code, roughly 6 times slower compared to PSQL procedure and the execution of .NET procedure is in `0,013 ms` per call range.

Hard numbers from one of the runs:

```text
PSQL: 00:00:00.2236717
.NET: 00:00:01.3434364
Ratio: 6,00628689279869
ms/call: 0,013434364
```

I'll leave that to you to decide whether that's fast enough for you or not. I'm working with initial partner [ElektLabs][3] to get some real feedback on what's fine and where some improvements need to be applied. If you'd like to share your thoughts, feel free to use comments below. If you'd like to do some tests yourself (and/or help moving this forward), [drop me a line][4].  

[1]: {% include post_link, id: "233625" %}
[2]: {% include post_link, id: "233637" %}
[3]: http://www.elektlabs.cz/    
[4]: /about/