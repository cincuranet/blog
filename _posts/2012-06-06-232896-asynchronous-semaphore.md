---
title: "Asynchronous semaphore"
date: 2012-06-06T18:23:18Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/232896/
layout: post
---
I was just checking some documentation around [System.Threading namespace for .NET 4.5][1] and I found that there's one nice addition to synchronization primitives.

As you might imaging using [async/await][2] with synchronization primitives isn't particularly good idea, because you can easily make a mistake and end up with code that looks correct but produces completely wrong results.

But still, for some primitives it might be useful. The BCL team (or whoever is responsible to this part) decided, the [SemaphoreSlim][3] is worth it. The method is [SemaphoreSlim.WaitAsync][4].

Nice. This might nicely play with some legacy threading code.

[1]: http://msdn.microsoft.com/en-us/library/798axes2(v=vs.110)
[2]: http://msdn.microsoft.com/en-us/library/hh191443(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/dd271035(v=vs.110)
[4]: http://msdn.microsoft.com/en-us/library/hh462788(v=vs.110).aspx