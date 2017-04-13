---
title: |-
  Async semaphore with priority
date: 2014-02-28T05:51:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
I know priorities in parallel or multithreaded programming are not a best idea. At least we should try to avoid these as long as it's possible. And a locking or synchronization into the mix and you have a recipe for possible deadlocks. We don't like deadlocks. Users don't like deadlocks. But I had no choice today.

<!-- excerpt -->

Yes, I needed priorities. Or at least some ordering. Given the operations I was working on I was dealing with [semaphores][1]. My favorite type of synchronization primitive. But I wanted to do as less blocking as possible. Blocking is wasting. This is where [`SemaphoreSlim.WaitAsync`][4] comes handy. But once I tried solving the problem with multiple semaphores and some events, I concluded I really need to priorities. Luckily I remembered [Stephen Toub blogged about Building Async Coordination Primitives][2] where he also explored [`AsyncSemaphore`][3]. Good, that's a head start.

I just needed to add some priorities (in my case just two, but it can be extended to any number, even using unlimited/dynamic). If you look at the original implementation you'll realize it's not difficult. You just need to add more queues for different priorities. Then dequeue based on priorities.

```csharp
sealed class AsyncPrioritySemaphore : IDisposable
{
	public enum Priority
	{
		High,
		Normal,
	}

	readonly static Task CompletedTask = Task.FromResult<object>(null);
	readonly object _syncRoot;
	readonly Queue<TaskCompletionSource<object>> _waitersHigh;
	readonly Queue<TaskCompletionSource<object>> _waitersNormal;
	int _currentCount;

	public AsyncPrioritySemaphore(int initialCount)
	{
		if (initialCount < 0)
			throw new ArgumentOutOfRangeException("initialCount");

		_syncRoot = new object();
		_waitersHigh = new Queue<TaskCompletionSource<object>>();
		_waitersNormal = new Queue<TaskCompletionSource<object>>();
		_currentCount = initialCount;
	}

	public Task WaitAsync(Priority priority)
	{
		lock (_syncRoot)
		{
			if (_currentCount > 0)
			{
				--_currentCount;
				return CompletedTask;
			}
			else
			{
				var waiter = new TaskCompletionSource<object>();
				var waiters = default(Queue<TaskCompletionSource<object>>);
				switch (priority)
				{
					case Priority.High:
						waiters = _waitersHigh;
						break;
					case Priority.Normal:
						waiters = _waitersNormal;
						break;
					default:
						throw new ArgumentOutOfRangeException("priority");
				}
				waiters.Enqueue(waiter);
				return waiter.Task;
			}
		}
	}

	public void Release()
	{
		TaskCompletionSource<object> toRelease = null;
		lock (_syncRoot)
		{
			if (_waitersHigh.Count > 0)
				toRelease = _waitersHigh.Dequeue();
			else if (_waitersNormal.Count > 0)
				toRelease = _waitersNormal.Dequeue();
			else
				++_currentCount;
		}
		if (toRelease != null)
		{
			// separate task to avoid stack overflow on continuations
			Task.Factory.StartNew(o => (o as TaskCompletionSource<object>).SetResult(null), toRelease, TaskCreationOptions.HideScheduler).Wait();
		}
	}

	public void Dispose()
	{ } // convenience to support easy switching from other primitives
}
```

What might be surprising for you is that I'm spinning new `Task` in `Release` method. The [`SetResult`][5] method causes the continuations to be executed. But it's executed as part of `SetResult`'s call. Synchronously. After testing the semaphore (either the `AsyncSemaphore` or mine `AsyncPrioritySemaphore`) under high load you would quickly find (as I did) that you end up with very deep stacks eventually running out of space and ending with stack overflow. So it's a little bit waste of resources, but it's better than failing, in my opinion. :)

Enjoy. Improvements are welcome.

> [The story continues.][6]

[1]: http://en.wikipedia.org/wiki/Semaphore_(programming)
[2]: http://social.msdn.microsoft.com/Search/en-US?query=%22Building%20Async%20Coordination%20Primitives%22&beta=0&rn=.NET+Parallel+Programming&rq=site:blogs.msdn.com/b/pfxteam/&ac=4
[3]: http://blogs.msdn.com/b/pfxteam/archive/2012/02/12/10266983.aspx
[4]: http://msdn.microsoft.com/en-us/library/hh462723(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/dd449202(v=vs.110).aspx
[6]: {% include post_id_link id="233486" %}