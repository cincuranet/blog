---
title: |-
  Executing method in intervals - good and bad approaches
date: 2012-04-05T15:43:36Z
tags:
  - .NET
  - Best practice or not?
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
  - Reactive Extensions (Rx)
layout: post
---
In last few days I've seen couple of pieces of code with "executing method every x seconds". And a lot of bad. Not buggy, but superfluously expensive. I'm also here adding a simple loop to run just 10 times.

The first bad one is simply using [Thread][1] and [Sleep][2] method.

```csharp
void BadOne1()
{
	Thread t = new Thread(o =>
		{
			for (int i = 0; i < 10; i++)
			{
				Console.WriteLine("BadOne1");
				Thread.Sleep(1000);
			}
		});
	t.Start(null);
}
```

Problem is the `Thread` object is very expensive and it's used only fraction of time. The rest is blocked. Simply wasted resources.

I've also seen slightly better version.

```csharp
void BadOne2()
{
	ThreadPool.QueueUserWorkItem(o =>
		{
			for (int i = 0; i < 10; i++)
			{
				Console.WriteLine("BadOne2");
				Thread.Sleep(1000);
			}
		});
}
```

This is really just a little bit better. `ThreadPool` thread is used, but again, the thread is doing nothing a lot of time. Again wasted resources.

Better approach is to use [Timer][3]. This way you're not wasting resources by abusing threads. The callback from `Timer` is executed when the interval is elapsed (on `ThreadPool` thread). Rest of the time it's just sits there waiting for next tick.

```csharp
void GoodOne1()
{
	int i = 0;
	Timer t = null;
	t = new Timer(o =>
		{
			Console.WriteLine("GoodOne1");
			if (Interlocked.Increment(ref i) == 10)
			{
				// could tick, still
				t.Change(Timeout.InfiniteTimeSpan, Timeout.InfiniteTimeSpan);
				t.Dispose(); // or somewhere else
			}
		}, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
}
```

Here I'd like to point to [my older post about keeping the reference to `Timer`][4].

And also one question that might come. The `Timer` ticks every interval no matter how long executing the callback took. That might not be what you want. You may want to execute the method with xx seconds delay between (previous examples), not execute the method every xx second (this example). The solution is pretty easy. Initially just schedule one tick and then reschedule it for next interval.

```csharp
void GoodOne2()
{
	int i = 0;
	Timer t = null;
	t = new Timer(o =>
		{
			Console.WriteLine("GoodOne2");
			if (Interlocked.Increment(ref i) == 10)
			{
				// could tick, still
				t.Change(Timeout.InfiniteTimeSpan, Timeout.InfiniteTimeSpan);
				t.Dispose(); // or somewhere else
			}
			else
			{
				t.Change(TimeSpan.FromSeconds(1), Timeout.InfiniteTimeSpan);
			}
		}, null, TimeSpan.Zero, Timeout.InfiniteTimeSpan);
}
```

All these are kinda low level. But you can use [Reactive Extensions (Rx)][5] to write it in more succinct way, but internally the core idea is same as with `Timer`.

```csharp
void GoodOne3()
{
	IDisposable obs = null;
	obs = Observable
		.Timer(TimeSpan.Zero, TimeSpan.FromSeconds(1))
		.Take(10)
		.Subscribe(_ =>
			{
				Console.WriteLine("GoodOne3");
			}, () => obs.Dispose() /* or somewhere else */);
}
```

No matter what approach you'll use, please don't (ab)use threads (manually created or `ThreadPool` ones). Threads are small little nice sweet creatures that don't deserve to be treated like this. And. Don't forget to cleanup resources (i.e. `Timer` is [`IDisposable`][6]).

[1]: http://msdn.microsoft.com/en-us/library/system.threading.thread.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.threading.thread.sleep.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.timer.aspx
[4]: {% include post_link id="230984" %}
[5]: http://msdn.microsoft.com/en-us/data/gg577609
[6]: http://msdn.microsoft.com/en-us/library/system.idisposable.aspx