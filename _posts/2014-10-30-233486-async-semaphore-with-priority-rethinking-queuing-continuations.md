---
title: "Async semaphore with priority: Rethinking queuing continuations"
date: 2014-10-30T06:11:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233486/
category: none
layout: post
---
When [I wrote the AsyncPrioritySemaphore few months ago][1] I quickly found how the continuations are processed once "unleashed". Lately I was using the same class again and I was monitoring the behavior. That made me think about what could be done and how.

<!-- excerpt -->

Let me quickly recap. The original `Release` method looked like this.

```csharp
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
```

As the comment says I'm calling the [`SetResult` method][2] using a `Task` to avoid stack overflows. The `SetResult` call the continuations synchronously, hence if you have a deep chain of methods waiting on the semaphore you'll run out of stack. 

I'm also calling [`Wait`][3] on the `Task`. My original reasoning was that I want to be sure the continuations are processed and I, if any, receive (don't loose) exceptions (although I'm not handling exception, I just want them to bubble up). <small>There was also a discussion about this in comments. Read it if you're interested.</small>

Recently I was improviny my knowledge about `async`/`await` internals and threading/locking internals and decided to re-evaluate my original reasoning. After some testing I decided to change the method.

```csharp
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
		// break the stack to avoid stack overflow on continuations
		ThreadPool.QueueUserWorkItem(o => (o as TaskCompletionSource<object>).SetResult(null), toRelease);
	}
}
```

I ditched waiting and also used [`ThreadPool` class][4] directly. Why no longer the waiting? As you release the lock you want others to continue running (if there are resources) and yourself as well. Releasing the semaphore should just open the gate(s) and off you go. Waiting for others to complete doesn't make sense. Also as I learned how the exceptions from continuations are be handled, I realized the `Wait` is not needed. I don't loose them.

Once the `Wait` was gone there was little reason to keep using `Task`. I could queue the method to `ThreadPool` directly myself (if you don't say otherwise the `Task` uses `ThreadPool`). I was also thinking about using [`UnsafeQueueUserWorkItem` method][5], but I can't prove (or disprove) myself that it's correct (or not). So I just took the safe path. Maybe in next iteration. :)

I'm running it in, same as previous version, a high-load environment. Hope I'll learn something new again.

[1]: {{ site.address }}{% post_url 2014-02-28-233445-async-semaphore-with-priority %}
[2]: http://msdn.microsoft.com/en-us/library/dd449202(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.wait(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.threadpool(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.threadpool.unsafequeueuserworkitem(v=vs.110).aspx