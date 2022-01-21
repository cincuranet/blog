---
title: |-
  New Task.WaitAsync method in .NET 6
date: 2022-01-21T09:49:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
.NET 6 has this new handy method on `Task` called `WaitAsync`. It might not look like a big deal. Basically, the asynchronous version of `Wait`, right? Yes, but also it closes one gap that was often implemented poorly.

<!-- excerpt -->

Sometimes you have task method that does not support any kind of cancellation, yet you still want to use it. The often-used approach is to use `Task.Delay` and plug it into `Task.WhenAny`. I created my own version quite some time ago [here][1]. The catch is to properly cancel the `Task.Delay` task in case the original task completed before timeout. Else the _timer queue_ might become bottleneck.

However, starting with .NET 6 you can use the mentioned [`WaitAsync`][2] method to do the same. 

```csharp
await Foo().WaitAsync(TimeSpan.FromSeconds(5));

async Task Foo()
{
	while (true)
	{
		await Task.Delay(100);
	}
}
```

Easy and direct. No extra code needed. The `WaitAsync` has other overloads where you can also pass `CancellationToken` giving you more options.

Although libraries providing task-based methods should have story for passing `CancellationToken`s, it is not always the case. It's nice to have option for "timeout" now directly in .NET.

[1]: {{ include "post_link" 233481 }}
[2]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.waitasync?view=net-6.0
