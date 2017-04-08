---
title: |-
  Scheduling absolute time operations with Timer
date: 2013-10-23T08:03:00Z
tags:
  - Reactive Extensions (Rx)
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
Sometimes I'm coding a simple task – start an operation at a given time. Some kind of scheduler in inside application. No, I'm not going to cry over [`Thread`][1] and [`Thread.Sleep`][2] abuse. I'm over it. :) It's [`Timer`][3] usage.

<!-- excerpt -->

That's of course way better than above mentioned abuse. But let's say you want to run the operation every day at 14:00 (that's 2PM for some ;)). The code is often like this (or close to it).

```csharp
var timer = new Timer(_ =>
{
	var now = DateTimeOffset.UtcNow; // or maybe in your local time
	if (now.Hour == 14 && now.Minute == 0)
	{
		// ...
	}
}, null, TimeSpan.Zero, TimeSpan.FromMinute(1));
```

Pretty simple, right? It's even not wrong. Ticking every minute will probably have small impact on the system (thread pool) and very often it will run almost no code. But it can be done better.

When you're starting the ticking you can compute when the next tick should be, right? Same as when you finish (or start) the operation. You just need to reschedule. The rescheduling might be tricky, but you actually can move the `Timer` forward (I often refer to this on my courses as "kick" or "kicking the timer" using [`Change`][4] method. Whenever you want. It's something that might not be immediately obvious. Let's see the code.

```csharp
var timer = default(Timer);
timer = new Timer(o =>
{
	try
	{
		callback(o);
	}
	finally
	{
		timer.Change(ComputeNext(), Timeout.InfiniteTimeSpan);
	}
}, null, ComputeNext(), Timeout.InfiniteTimeSpan);
```

I just need to first declare the variable because I'll use it in the lambda/delegate. Then I simply compute the interval (`TimeSpan`) between "now" and the date/time the operation should happen. With that I have a `Timer` instance that will tick just once. But at the end (you can to it even as a first step) I'll "kick" it forward and I'm done.  
<small>[It's similar trick as if you'd like to take into account how long the method's execution took.][5]</small>

And that's it. I created a simple helper for it, so you can just grab it and use it. Or change for different intervals (not daily). I also created one overload for `async` methods, because else the behavior would not be correct ([`TimerCallback`][6] is basically `Action<object>` and hence void returning method aka you cannot `await` it).


Also if you're using Rx (Reactive Extensions) you can use [this overload][7] ([with `IScheduler`][8]) of [`Observable.Timer`][9] to do the same (maybe using more succinct code).

```csharp
static class DailyHourMinuteTimerHelper
{
	public static Timer Create(int hour, int minute, Func<DateTimeOffset> nowFactory, TimerCallback callback, object state)
	{
		return Create(hour, minute, nowFactory, o => { callback(o); return Task.FromResult<object>(null); }, state);
	}

	public static Timer Create(int hour, int minute, Func<DateTimeOffset> nowFactory, Func<object, Task> callback, object state)
	{
		var timer = default(Timer);
		timer = new Timer(async o =>
		{
			try
			{
				await callback(o);
			}
			finally
			{
				timer.Change(FixTimer(ComputeDueTime(nowFactory, hour, minute)), Timeout.InfiniteTimeSpan);
			}
		}, state, FixTimer(ComputeDueTime(nowFactory, hour, minute)), Timeout.InfiniteTimeSpan);
		return timer;
	}

	static TimeSpan FixTimer(TimeSpan timeSpan)
	{
		// on these long intervals the Timer drifts a little (probably because time corrections when synchronized from NTP)
		// but because I'm on a minute precision I don't care a second
		return timeSpan.Add(TimeSpan.FromSeconds(1));
	}

	static TimeSpan ComputeDueTime(Func<DateTimeOffset> nowFactory, int hour, int minute)
	{
		return ComputeNext(nowFactory(), hour, minute) - nowFactory();
	}

	static DateTimeOffset ComputeNext(DateTimeOffset now, int hour, int minute)
	{
		var next = new DateTimeOffset(now.Year, now.Month, now.Day, hour, minute, 0, now.Offset);
		if (next <= new DateTimeOffset(now.Year, now.Month, now.Day, now.Hour, now.Minute, 0, now.Offset))
			next = next.AddDays(1);
		return next;
	}
}
```

[1]: http://msdn.microsoft.com/en-us/library/system.threading.thread.aspx
[2]: http://msdn.microsoft.com/en-us/library/274eh01d.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.timer.aspx
[4]: http://msdn.microsoft.com/en-us/library/317hx6fa.aspx
[5]: {% post_url 0000-00-00-232782-executing-method-in-intervals-good-and-bad-approaches %}
[6]: http://msdn.microsoft.com/en-us/library/system.threading.timercallback.aspx
[7]: http://msdn.microsoft.com/en-us/library/hh244323(v=vs.103).aspx
[8]: http://msdn.microsoft.com/en-us/library/hh229176(v=vs.103).aspx
[9]: http://msdn.microsoft.com/en-us/library/system.reactive.linq.observable.timer(v=vs.103).aspx