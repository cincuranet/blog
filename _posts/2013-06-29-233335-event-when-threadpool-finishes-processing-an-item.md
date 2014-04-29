---
title: "Event when ThreadPool finishes processing an item"
date: 2013-06-29T08:22:24Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
category: none
layout: post
---
Yesterday I was doing my [parallel-threading-async-locking course][1] and at one time we discussed (unplanned) [Thread Local Storage (TLS)][2] with one participant. To make a long story short they needed to know when processing of some item in [`ThreadPool`][3] completed. The default implementation of `ThreadPool` doesn't have such event, but luckily we can create such one. I sketched this in under five minutes and I think it might be worth for others.

<!-- excerpt -->

It's just a proof of concept. But you can change it for you specific usage. If you dive deep (enough) you'll more or less end up with [`Task`][4] object. :)

<pre class="brush:csharp">
class MyThreadPool
{
	public static event EventHandler OperationCompleted;

	public static void QueueUserWorkItem(WaitCallback operation, object state)
	{
		ThreadPool.QueueUserWorkItem(o =&gt;
			{
				try
				{
					operation(o);
				}
				finally
				{
					OnOperationCompleted();
				}
			}, state);
	}

	static void OnOperationCompleted()
	{
		if (OperationCompleted != null)
			OperationCompleted(null, EventArgs.Empty);
	}
}
</pre>

[1]: http://www.x2develop.com/
[2]: http://en.wikipedia.org/wiki/Thread-local_storage
[3]: http://msdn.microsoft.com/en-us/library/System.Threading.ThreadPool.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.aspx