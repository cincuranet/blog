---
title: "Better \"cached completed Task\""
date: 2014-05-08T07:17:00Z
tags:
  - C#
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233455/
layout: post
---
I like the topics of _threading_, _parallelism_ or _asynchronous_ processing. Maybe it's because it's similar to problems you're solving when dealing with transactions and concurrent access. Or maybe vice versa. Anyway, I like to look at various "helper" libraries people are using. Especially around [Task Parallel Library (TPL)][1].

Sometimes the libraries are pure hacks, which is good for learning too. Sometimes you see they want to bend the framework as little as possible but the circumstances aren't always as they would like to have. That's even more fascinating.

<!-- excerpt -->

What I often see is creating a "precomputed already completed" `Task`. In any reasonable sized program you have paths that are kind of lucky - you can return immediately, you already know the result etc. Often it's called _fast path_. This means you're likely not spinning up tasks to compute the result but you just signal that it's already there. And instead of returning task that immediately completes you return one that's already completed and you're reusing it all over the place. This has benefit of always not creating new object and hence putting less stress on garbage collector.  Given that you're trying to have the result faster and thus you're likely parallelizing the algorithm why waste time creating garbage objects, right?

The code might look like this.   

```csharp
public static class TaskEx
{
	public static Task CompletedTask { get; private set; }

	static TaskEx()
	{
		var tcs = new TaskCompletionSource<object>();
		tcs.SetResult(null);
		CompletedTask = tcs.Task;
	}
}
```

Nothing special. And it's correct! Nothing wrong with that. But you can squeeze a little bit more from that.

Task Parallel Library already has such object, because it's using it internally quite often. But it's sadly internal. Luckily you can get access to it. And I'm not talking _reflection_, that would be way too slow. Because TPL contains some _fast path_ optimizations itself we can take advantage of that. Such simple one is [`Task.Delay(0)`][2]. If you're delaying by `0` milliseconds why bother to even delay? The code has simple branch to accomodate this.

```csharp
else if (millisecondsDelay == 0)
{
    // return a Task created as already-RanToCompletion
    return Task.CompletedTask;
}  
```

Thus if you need somewhere this "cached already completed" `Task` you can simply return `Task.Delay(0)` and the outcome will be se as with your hand-made `TaskEx.CompletedTask`. 

Both ways are valid and correct. The `Task.Delay(0)` is just there waiting for you, and even probably `ngen`ed.

> [On .NET 4.6 and up you can use `Task.CompletedTask` directly.][3]

[1]: http://msdn.microsoft.com/en-us/library/dd460717(v=vs.110).aspx
[2]: http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs#5868
[3]: {{ site.address }}{% post_url 2015-02-13-233500-task-completedtask-in-net-46 %}