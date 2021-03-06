---
title: |-
  Timing out task
date: 2014-10-21T18:14:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Last week I was working with pretty bad library that from time to time got stuck. No progress. Given the library was fairly young and supported asynchronous methods I suspect there was a deadlock/livelock somewhere. Although the code was open source I had no time (or intention) to debug it. I just needed quick fix.

<!-- excerpt -->

I knew the method call should take in worst case scenario a minute or so. So some timing out was possible. Sadly no support for [CancellationToken][1] in library. So I had to make my own timeout. Pretty simple method.

```csharp
public static async Task Timeout(this Task operation, TimeSpan timeout)
{
	using (var cts = new CancellationTokenSource())
	{
		var timeoutTask = Task.Delay(timeout, cts.Token);
		var any = await Task.WhenAny(new[] { timeoutTask, operation }).ConfigureAwait(false);
		if (any == timeoutTask)
			throw new TimeoutException();
		else
			cts.Cancel();
	}
}
```

The method waits for one of two tasks. One just "delayed" by expected timeout and the one that's doing the work. If the one completed first is the one doing the timeout I know the other one is stuck (or simply still running) and I throw exception. That's it.

It's pretty dirty method. Before using it you should know that the actual task is still running and keeps running. It's not killed. You just don't care. So you should handle your scenario appropriately - like reentrancy, pure methods etc. Also look at [Wait method][2] it might be helpful too.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.cancellationtoken(v=vs.110).aspx
[2]: http://msdn.microsoft.com/en-us/library/dd235606(v=vs.110).aspx