---
title: "How slow the \"lock\" statement actually is?"
date: 2014-10-26T08:27:00Z
tags:
  - C#                
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
When I'm teaching my ["parallel-threading-asynchronous-locking-synchronization" course][1] I discuss the [`lock` statement][2] a lot. Not only because it's probably the most widely used "lock", but also because it's pretty easy to fall into a trap if you don't know what's going on behind the scenes and around you.

Anyway. I often show how the `lock` is translated into `try`-`finally` block and that it does not come for free. And among other things I'm trying to get into the brains of the people I'm teaching is that you should spent as less time as possible inside `lock` (of course, with some exceptions) - less contention equals less waiting hence more resources used for real work.

<!-- excerpt -->

I kind of know the `finally` block isn't cheap. But how much? Does it really make sense to try to avoid it? Last night, being in the hotel, I decided to test it. As with every test it's one particular scenario and the mileage might vary.

I created a simple test code.

```csharp
class Program
{
	static object SyncRoot = new object();
	static int Dummy = 0;

	static void Main(string[] args)
	{
		const long TestsCount = 400000000;
		Stopwatch sw;

		TimeSpan lockElapsed;
		TimeSpan monitorElapsed;

		LockTest();
		MonitorTest();

		sw = Stopwatch.StartNew();
		for (long i = 0; i < TestsCount; i++)
		{
			LockTest();
		}
		lockElapsed = sw.Elapsed;

		sw = Stopwatch.StartNew();
		for (long i = 0; i < TestsCount; i++)
		{
			MonitorTest();
		}
		monitorElapsed = sw.Elapsed;

		Console.WriteLine("Lock    : {0}", lockElapsed);
		Console.WriteLine("Monitor : {0}", monitorElapsed);
		Console.WriteLine("%       : {0}", (double)lockElapsed.Ticks / (double)monitorElapsed.Ticks);

		Console.WriteLine(Dummy);
	}

	static void LockTest()
	{
		lock (SyncRoot)
		{
			Dummy++;
		}
	}

	static void MonitorTest()
	{
		Monitor.Enter(SyncRoot);
		{
			Dummy++;
		}
		Monitor.Exit(SyncRoot);
	}
}
```

Really nothing special (I hope I haven't overlooked something important). I get some stopwatch to measure the time, warm up the methods and start running in a loop. I did few test runs (discarding numbers that were very off) without debugger attached and (of course) with optimizations turned on. I also tried how the 32bit vs 64bit ("Prefer 32-bit" checkbox) affects the result.

So what's the numbers? As expected using the [`Monitor.Enter`][3] and [`Monitor.Exit`][4] is faster than using `lock` statement. I saw numbers between 15&nbsp;% and 17&nbsp;%. With "Prefer 32-bit" turned on. Surprisingly with "Prefer 32-bit" turned off (and on a 64bit OS) the difference was only about between <1&nbsp;% and 3&nbsp;%. Pretty interesting.

There's one catch, though. The `lock` statement translation is not what I wrote in `MonitorTest` method (among the `try`-`finally`). It actually uses the [`Monitor.Enter` overload with the `ref bool lockTaken` parameter][5]. So the method would rather be.

```csharp
static void MonitorTest()
{
	var lockTaken = false;
	Monitor.Enter(SyncRoot, ref lockTaken);
	{
		Dummy++;
	}
	if (lockTaken)
		Monitor.Exit(SyncRoot);
}
```

Is there a change in results now? Yes, a bit. Again the 32bit first. Now it was between about 17&nbsp;% and 18&nbsp;%. But the 64bit was between 0&nbsp;% (few times the `lock` was even faster, though it was on a measurement error boundary) and 2&nbsp;%.

Now you might think that few percent difference on a μs operation is not important. Sure. But also take into account that when you start writing some locking or synchronization you want it to be fast. To utilize all resources you have available for getting the result. That means (not only) getting in and out the lock as fast as you can. 

As usual the decision is on you.

> [Part 2 of this story.][6]

[1]: http://www.x2develop.com
[2]: http://msdn.microsoft.com/en-us/library/c5kehkcz.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.monitor.enter(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.monitor.exit(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/dd289498(v=vs.110).aspx
[6]: {% post_url 2014-10-29-233485-how-slow-the-lock-statement-actually-is-part-2 %}