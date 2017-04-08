---
title: |-
  Projection (select) on a collection running in parallel with exceptions handling
date: 2010-08-04T15:20:52Z
tags:
  - .NET
  - LINQ
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
Few days ago I posted an [extension method to run projection on a collection in parallel][1]. The method has one problem. It's not dealing with exceptions. And because the ordering wasn't (and isn't) implicitly preserved, I did this small improvement.

Right now the method returns simple structure with original item, the result (if no exception occured, sure) and exception (if any). I didn't went to [AggregateException][2] (although you can modify the code yourself to use it). Now you can decide while consuming what to do when exception occurred. Adding some kind of cancellation shouldn't be difficult.

The idea behind is the same as in [previous version][3].

```csharp
#region ParallelProjection
internal struct ParallelProjectionResult<TSource, TResult>
{
	public TSource Item { get; set; }
	public TResult Result { get; set; }
	public Exception Exception { get; set; }
}
internal static IEnumerable<ParallelProjectionResult<TSource, TResult>> ParallelProjection<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> projection, int maxParallelism)
{
	BlockingCollection<ParallelProjectionResult<TSource, TResult>> results = new BlockingCollection<ParallelProjectionResult<TSource, TResult>>();
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
						TSource e = (TSource)element;
						ParallelProjectionResult<TSource, TResult> result = new ParallelProjectionResult<TSource, TResult>();
						result.Item = e;
						try
						{
							result.Result = projection(e);
						}
						catch (Exception ex)
						{
							result.Exception = ex;
						}
						results.Add(result);
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
#endregion
```

[1]: {% post_url 0000-00-00-231850-projection-select-on-a-collection-running-in-parallel %}
[2]: http://msdn.microsoft.com/en-us/library/system.aggregateexception.aspx
[3]: {% post_url 0000-00-00-231850-projection-select-on-a-collection-running-in-parallel %}