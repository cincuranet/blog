---
title: "SemaphoreSlim's WaitAsync puzzle"
date: 2014-01-09T06:45:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233438/
category: none
layout: post
---
While I was digging into some locking I discovered interesting behavior. It behaves completely as it should, if you follow strictly the process in your brain. But we often skip some steps because we think we know better/faster. So let's start.

<!-- excerpt -->

Suppose we have a simple method that generates us few numbers and as a side effect prints these.

```csharp
static IEnumerable<int> D()
{
	for (int i = 0; i < 10; i++)
	{
		Console.WriteLine("Yielding: {0}", i);
		yield return i;
	}
}
```

Let's have a task to process these numbers. Because you have limited resources you only want to process `N` at a time (in this case `N` can be whatever number less than number of elements `D` yields, but `1` or `2` is good to make it simple). But you don't want to block (i.e. interleaving operations as it progresses further). Something like this.

```csharp
static async Task Process(SemaphoreSlim sem, int x)
{
	await sem.WaitAsync().ConfigureAwait(false);

	// simulate some CPU-work for roughly a 500ms
	var end = DateTime.UtcNow.AddMilliseconds(500);
	while (end > DateTime.UtcNow)
		Thread.SpinWait(9999999);

	// simulate some IO-work for roughly a 500ms
	await Task.Delay(500).ConfigureAwait(false);

	Console.WriteLine(x);

	sem.Release();
}
```

And you start it completely.

```csharp
static void Main(string[] args)
{
	using (var sem = new SemaphoreSlim(2, 2))
	{
		var tasks = D().Select(async x =>
		{
			await Process(sem, x).ConfigureAwait(false);
		}).ToArray();
		Task.WaitAll(tasks);
	}
}
```

What do you think will be written out? Think about it for a while. Solution is just below.

.

.

.

.

.

.

OK. Here's the wrong solution (I started with this too and found it surprising (because I was not thinking carefully)). The enumerations starts; `0` is yielded; I'm asynchronously waiting for a semaphore, which will be satisfied immediately, so the `Task` is "returned", rest is continuation; next item starts; semaphore will be released. And so on. Thus I'll see on a console (the order after `Yielding: XXX` will be "random"):

```text
Yielding: 0
Yielding: 1
Yielding: 2
Yielding: 3
Yielding: 4
Yielding: 5
Yielding: 6
Yielding: 7
Yielding: 8
Yielding: 9
0
2
1
3
5
4
6
7
8
9
```

But what will actually see is:

```text
Yielding: 0
Yielding: 1
0
Yielding: 2
1
Yielding: 3
2
Yielding: 4
3
Yielding: 5
4
Yielding: 6
5
Yielding: 7
6
Yielding: 8
7
Yielding: 9
8
9
```

As it turns out the previous "reverse engineering" of what happens has a small flaw. What actually happens is slightly different. The enumeration starts; `0` is yielded; I'm asynchronously waiting for a semaphore, which will be satisfied immediately, hence the code will continue synchronously (there's no need to start all the machinery with continuations); I'll "compute" for 500ms; I'll "non-blockingly wait" for 500ms, rest is (really) continuation; next item starts; semaphore will be released. And so on.

To be honest it took me a while before I realized the flaw in my thinking. I completely ignored the "fast-path" in the code.

Anyway if you'd like to force (efficiently) creation of continuation you can use [`Task.Yield` method][1].

```csharp
static void Main(string[] args)
{
	using (var sem = new SemaphoreSlim(2, 2))
	{
		var tasks = D().Select(async x =>
		{
			await Task.Yield();
			await Process(sem, x).ConfigureAwait(false);
		}).ToArray();
		Task.WaitAll(tasks);
	}
}
```

_So how you scored?_

[1]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.yield(v=vs.110).aspx