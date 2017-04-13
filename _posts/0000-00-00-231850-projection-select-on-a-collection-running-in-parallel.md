---
title: |-
  Projection (select) on a collection running in parallel
date: 2010-08-02T16:23:05Z
tags:
  - .NET
  - LINQ
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
> [Here's updated version of the method.][1]

I have here another not-general-purpose-parallel/multihtreaded-method. :) To make a long story short I needed do some transformation on collection's elements, aka projection. Unfortunately the method I was plugging in was doing some network requests, in fact couple of requests. Sequentially, blocking processing until the response came back. I know a proper way will be to turn these requests into asynchronous, unluckily this was part of bigger architecture I could not change.  I didn't want to use [AsParallel][2] method as I expected a need for more control maybe sometime later. So I solved it abusing [ThreadPool][3] threads. Bad for scheduler and memory, as I'll be wasting threads and resources, blocking, until reply is sent by server, but very easy for me. I told you, abusing. ;)

So I came with this method. It's utilizing new .NET Framework 4 [concurrent collections][4], [BlockingCollection][5] in particular as it's great for [producer-consumer scenario][6] and I want the method to return results whenever one is done (that also implies the ordering isn't preserved).

```csharp
internal static IEnumerable<TResult> ParallelProjection<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> projection, int maxParallelism)
{
	BlockingCollection<TResult> results = new BlockingCollection<TResult>();
	ThreadPool.QueueUserWorkItem((o) =>
	{
		Semaphore semaphore = new Semaphore(maxParallelism, maxParallelism);
		CountdownEvent countdown = new CountdownEvent(1);
		try
		{
			foreach (var item in source)
			{
				countdown.AddCount();
				semaphore.WaitOne();
				ThreadPool.QueueUserWorkItem(
					(element) =>
					{
						results.Add(projection((TSource)element));
						semaphore.Release();
						countdown.Signal();
					},
					item);
			}
			countdown.Signal();
			countdown.Wait();
			results.CompleteAdding();
		}
		finally
		{
			if (countdown != null)
				countdown.Dispose();
			if (semaphore != null)
				semaphore.Dispose();
		}
	}, null);
	return results.GetConsumingEnumerable();
}
```

The method is straightforward, a lot of work was saved using the smart blocking collection. I'm simply reading items from the collection and applying the function to them. To not overload the system with huge number of threads I also added `maxParallelism` parameter. When this number of threads is processing items, I'll stop scheduling more, using [Semaphore][7], until some are done and again available. When there's no item in source collection available and all item were processed I call [CompleteAdding][8] method to say I'm done and there will be no other items. Here I'm using [CountdownEvent][9] class initialized to `1` as you can't, of course, add items if it reaches `0`. Before final `Wait` I'm subtracting one to compensate this.

And that's it. Again, it's not general purpose method. Use with care, it may bring you even worse performance if wrongly used.

[1]: {% include post_id_link id="231892" %}
[2]: http://msdn.microsoft.com/en-us/library/system.linq.parallelenumerable.asparallel.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.threadpool.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.collections.concurrent.aspx
[5]: http://msdn.microsoft.com/en-us/library/dd267312.aspx
[6]: http://en.wikipedia.org/wiki/Producer-consumer_problem
[7]: http://msdn.microsoft.com/en-us/library/system.threading.semaphore.aspx
[8]: http://msdn.microsoft.com/en-us/library/dd287086.aspx
[9]: http://msdn.microsoft.com/en-us/library/system.threading.countdownevent.aspx