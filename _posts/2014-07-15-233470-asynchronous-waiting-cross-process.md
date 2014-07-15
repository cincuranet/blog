---
title: "Asynchronous waiting cross-process???"
date: 2014-07-15T10:54:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
category: none
layout: post
---
While trying to help customer with one problem idea came to my brain. Can you asynchronously wait cross-process? I.e. sending a signal from some kind of worker back to let's say ASP.NET application. Like the standard [`ManualResetEvent`][1] and so on. It might sound crazy and it's even more crazy when you think about it more.

<!-- excerpt -->

Let me start with small disclaimer. The solution below is not a good idea. It's not fully asynchronous. It's just a quick hack I made in 20 minutes. Better to use some [IPC][2]. It might be memory mapped file or simple network connection or ... you get the idea.

My original idea was to use some some kind of [`WaitHandle`][3] to get across processes and [`TaskCompletionSource<TResult>`][4] to signal the `await`ed task. But you have to actually somewhat _wait_ on the `WaitHandle` hence blocking. Suddenly it's falling apart. And once I'm blocking (luckily only on one side) I'd rather do it outside the calling thread, just to gave the _impression_ it's asynchronous. But I don't need `TaskCompletionSource<TResult>` then, right?

Here we go. Hacking.

<pre class="brush:csharp">
public class AsyncCrossProcessEvent : IDisposable
{
	EventWaitHandle _event;

	public AsyncCrossProcessEvent(string name, out bool createdNew)
	{
		_event = new EventWaitHandle(false, EventResetMode.ManualReset, name, out createdNew);
	}

	public void Set()
	{
		_event.Set();
	}

	public async Task WaitAsync()
	{
		await Task.Yield();
		_event.WaitOne();
	}

	public void Dispose()
	{
		var levent = Interlocked.Exchange(ref _event, null);
		if (levent != null)
		{
			levent.Dispose();
		}
	}
}
</pre> 

I'm creating `EventWaitHandle` with `EventResetMode.ManualReset` and passing the `name`. The `Set` method is pretty easy. It just signals the `EventWaitHandle`. 

Magic happens in `WaitAsync`. First I `Yield` to get out of the way of calling thread and then I _block_. Hence the caller will not be blocked, but some [`ThreadPool`][5] thread will. Don't worry, the `ThreadPool` will survive. 

And finally the `Dispose` method. Nothing special. I just free the `EventWaitHandle` (and I'll do it exactly once, even in case of concurrent access).

As I said, this is a bad solution. You should better not use it in production unless you know what are you doing.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.manualresetevent(v=vs.110).aspx
[2]: http://en.wikipedia.org/wiki/Inter-process_communication
[3]: http://msdn.microsoft.com/en-us/library/system.threading.waithandle(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/dd449174(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/dd449174(v=vs.110).aspx