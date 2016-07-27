---
title: "Do not overdo parallelism and asynchronous"
date: 2012-11-30T09:08:40Z
tags:
  - .NET
  - Best practice or not?
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
redirect_from: /id/233112/
layout: post
---
Sometimes it's easy to little bit overdo the need for having everything asynchronous and parallel. Quite often in last few weeks I've seen methods similar to this one.

```csharp
Console.WriteLine("Starting");
Parallel.For(1, 10, async i =>
{
	await Task.Delay(200);
	Console.WriteLine(i);
});
Console.WriteLine("Finished");
```

What's the result? For somebody maybe surprisingly:

```text
Starting
Finished
```

Why? What we see here is a two pieces "process". First the [`Parallel.For`][1]. This methods runs the provided method in parallel (for our discussion it doesn't matter how and what exactly that means) and waits for all methods to complete. The [lambda expression][2] we're providing is asynchronous. And though the `async`/`await` simplified the programming a lot, it's still standing on basic principles around [`Tasks`][3]. And that's the key for understanding what's wrong. The async lambda is basically (I'm simplifying here) starting a task to do the work and returning that task so you can eventually (a)wait it to complete. But the `Parallel.For` care about the method (all of them) returning, not (a)waiting tasks (it's actually an `Action<int>` also known as "async void" hence it has no idea about the task inside). And here you have it.

The question that's left is, how to fix it? :) Probably easiest way is to extract the lambda to method and wait for that task to complete. That will make the method blocking so the `Parallel.For` is not going to end prematurely.

```csharp
static void Main(string[] args)
{
	Console.WriteLine("Starting");
	Parallel.For(1, 10, i => Action(i).Wait());
	Console.WriteLine("Finished");
}
static async Task Action(int i)
{
	await Task.Delay(200);
	Console.WriteLine(i);
}
```

But wait. That's a little bit crazy, isn't it? We have tasks running asynchronously and we're spinning `Parallel.For` and waiting??? You can actually run the loop starting the asynchronous methods capturing the returned tasks and then use [`Task.WaitAll`][4] or if you want to go really deep async ;) you can use [`Task.WhenAll`][5] and `await` it.

If you'd like to see something like `ForEachAsync` (or maybe `ForAsync`) you can get and inspiration and other interesting notes from [this Stephen Toub's blog post][6].

[1]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.parallel.for.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb397687.aspx
[3]: http://msdn.microsoft.com/en-us/library/dd235608.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.waitall.aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.whenall.aspx
[6]: http://blogs.msdn.com/b/pfxteam/archive/2012/03/05/10278165.aspx