---
title: "Tasks - try on retrying, loops, recursions"
date: 2013-03-22T12:45:23Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
My mind today was in weird shape (again). I blame Friday. What that means is, that I came with weird pieces of code, that are fun to just write. Brain training. :)

<!-- excerpt -->

The set up was simple. I had a [`Task`][1] that was returning `bool`; `true` if succeeded, `false` otherwise. Because the code was interacting with 3<sup>rd</sup> party system it was desired to retry if the call didn't succeeded.

Looking at it in front of me I realized I'll be probably able to (ab)use the [`ContinueWith`][2] method and recursion. When I wrote it I realized there's a room for refactoring. And then I realized I might create and extension method from it. Already half way in hell. :)

```csharp
public static Task<TResult> Retry<TResult>(this Func<Task<TResult>> taskMethod, Func<TResult, bool> resultOK, int retries)
{
	return taskMethod()
		.ContinueWith(t =>
			retries == 0 || resultOK(t.Result)
				? Task.FromResult(t.Result)
				: Retry(taskMethod, resultOK, --retries))
		.Unwrap();
}
```

Umm, how it will look like with `await`, I thought. Then I can use loop.

```csharp
public static async Task<TResult> Retry2<TResult>(this Func<Task<TResult>> taskMethod, Func<TResult, bool> resultOK, int retries)
{
	while (true)
	{
		var result = await taskMethod();
		if (retries-- == 0 || resultOK(result))
			return result;
	}
}
```

This doesn't look nice. I thought it will be smoother. This is like 90s. Back to recursion.

```csharp
public static async Task<TResult> Retry3<TResult>(this Func<Task<TResult>> taskMethod, Func<TResult, bool> resultOK, int retries)
{
	var result = await taskMethod();
	return retries == 0 || resultOK(result)
		? result
		: await Retry3(taskMethod, resultOK, --retries);
}
```

That looks better. I don't know whether I like the first or the third version more. But. What about performance? The second version has least code to execute. No doubt. The third version has two `await`s and the recursion (nesting) with `await`s. This is probably not going to be good for performance. And my tests confirms that. Slightly slower than second is the first version. Thus the winner for me is version #1. 8-)

I'm not sure why I did this (from practical perspective), but it was fun. Have a great Friday.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.continuewith.aspx