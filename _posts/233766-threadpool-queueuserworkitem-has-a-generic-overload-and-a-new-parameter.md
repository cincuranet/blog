---
title: |-
  ThreadPool.QueueUserWorkItem has a generic overload (and a new parameter)
date: 2019-01-24T19:25:00Z
tags:
  - .NET Core
  - .NET Standard
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Although nowadays people, including me, are working mostly with tasks and async/await, sometimes going one level lower is helpful, because there's less to worry about. And as I was today calling trusty `ThreadPool.QueueUserWorkItem` I found new overload. Overload that is generic.

<!-- excerpt -->

Since the very beginning the `ThreadPool.QueueUserWorkItem` took `object` as a state that was passed to the `WaitCallback` delegate provided. That means if you passed value type, it was boxed and you then had to cast it back in the delegate. Boxing is not a great for performance (allocations) and casting is easy to mess up, especially when refactoring.

As it turned out, since in .NET Core 2.1 the method has a new generic overload [`bool QueueUserWorkItem<TState>(Action<TState> callBack, TState state, bool preferLocal)`][3]. In .NET Standard it's "only" starting from 2.1. Here is the [interesting commit][1] from [Stephen Toub][2]. This means both of the above-mentioned problems are not longer an issue.

What is the `preferLocal` parameter for? It allows you to queue the work item into thread pool thread's local queue compared to default behavior of going into global queue. That, in some scenarios, reduces contention on the global queue, improves cache locality or takes advantage of work stealing and probably some other things.

While I can use this overload today with .NET 2.1 or 2.2, it's sad it didn't make it into .NET Standard 2.0. On the other hand, all the performance goodness's (like well-known `Span<T>`) are in .NET Standard 2.1 anyway, so this one is only a drop in the ocean.

<small>The `UnsafeQueueUserWorkItem` has this new overload as well.</small>

[1]: https://github.com/dotnet/coreclr/pull/16570/commits/19f1317c42133f8cfa19aebc19b29bf83426b2c2
[2]: https://github.com/stephentoub
[3]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.threadpool.queueuserworkitem?view=netcore-2.2#System_Threading_ThreadPool_QueueUserWorkItem__1_System_Action___0____0_System_Boolean_