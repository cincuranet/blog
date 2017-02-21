---
title: |
  Array of WaitHandles (ManualResetEvent, AutoResetEvent, ...) when waiting for operations to complete ...
date: 2010-07-31T16:03:30Z
tags:
  - .NET
  - Best practice or not?
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
layout: post
---
Often, when you discover the beauty of multithreading and parallelism, you find a need to run some operations in parallel and wait for completion. Fairly common scenario. Although now, with .NET Framework 4, you can write it using [Task Parallel Library][1]'s [Parallel.Invoke][2], there are scenarios when you need to plug it in into some other methods/parameters, so you'll do it yourself explicitly with threads or better to say [ThreadPool][3].

The method I see from time to time looks basically like this:

```csharp
void DoSomethingExample()
{
	int numberOfActions = 10;
	ManualResetEvent[] mres = new ManualResetEvent[numberOfActions];
	for (int i = 0; i < numberOfActions; i++)
	{
		mres[i] = new ManualResetEvent(false);
		ThreadPool.QueueUserWorkItem((o) =>
			{
				Thread.SpinWait(20000000);
				(o as ManualResetEvent).Set();
			},
			mres[i]);
	}
	ManualResetEvent.WaitAll(mres);
}
```

Though it's not wrong, except the [ManualResetEvent][4]s are not [Dispose][5]d, it's suboptimal. You're wasting resources creating array of these objects.

But if you think about it, you can write it better. Better in a way for scaling, performance and memory consumption.

```csharp
void DoSomethingBetter()
{
	int numberOfActions = 10;
	using (ManualResetEvent mre = new ManualResetEvent(false))
	{
		for (int i = 0; i < numberOfActions; i++)
		{
			ThreadPool.QueueUserWorkItem((o) =>
				{
					Thread.SpinWait(20000000);
					if (Interlocked.Decrement(ref numberOfActions) == 0)
						mre.Set();
				},
				null);
		}
		mre.WaitOne();
	}
}
```

I'm simply using one synchronization object (and using `using` statement ;)), because I'm really interested in only when all tasks are done (one stuff), and decrementing the total number of tasks every time one finishes. Using [Interlocked][6] class I'm sure no race condition will occur and I'll get the right results. After it reaches zero I'm signaling I'm done and the method can continue.

Fewer resources, atomic operations usage ... better/faster results.

[1]: http://msdn.microsoft.com/en-us/library/dd460717.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.parallel.invoke.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.threadpool.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.manualresetevent.aspx
[5]: http://msdn.microsoft.com/en-us/library/system.idisposable.dispose.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.threading.interlocked.aspx