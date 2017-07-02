---
title: |-
  Checking for ConfigureAwait(false) automatically
date: 2014-09-09T11:20:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Roslyn
---
[Task Parallel Library (TPL)][1] and [`async`/`await`][2] functionality completely changes the game we - developers - were playing last years. Because it changes the game so much there's quite some implementation details that, when you want to play A game, need to be considered. It's not that the implementation is wrong or attacking the problem from wrong direction. It's just a trade-off. Basically to make a A- game ready without any additional learning.    

<!-- excerpt -->

#### Background

Let's talk for a while what `async`/`await` or actually just the `await` and compiler are doing. I'm going to simplify a bit, but the concept stays. When the compiler finds `await` it makes whatever follows so-called [_continuation_][3]. Once the code that followed `await` is done the continuation is queued for execution. That way the method (and ultimately the whole chain) never blocks. But where should the continuation run? Take a look at sample code. 

```csharp
var data = ComputeSomeData();
var result = await SendDataAsync(data);
ProcessResult(result);
```  

This code looks familiar. It looks like it's sequential, although it's not. This familiarity allows for easy writing and more importantly reading of the code. Big win (compared to i.e. [APM][4]). But in sequential code the `ProcessResult` would run for sure on same thread as the previous lines. But now as the continuations is queued whatever thread is available (from "some" thread pool) might run it. That would create havoc in UI as you would likely try manipulate with UI elements. Yes, some threads are born as better breed. Welcome UI thread. But because in computed science we love abstractions and threads are implementation detail in .NET we have [`SynchronizationContext`][5]. In fact the `SynchronizationContext` is not tight to thread. It's higher level concept. But we can pretend, to not make it more difficult, it's wrapper around UI thread (if you want you can look at `AspNetSynchronizationContext`). In .NET the continuation is queued into the _Current_ `SynchronizationContext`. That way the code behaves as much as closely as sequential code.

But often when you're not writing UI code and you're writing some library code you don't care about where the code will run - actually you shouldn't. Or you care a lot and then you're explicit about what you need - another story.     

#### `ConfigureAwait` madness

When `async`/`await` was created they were aware of the above fact. The default implementation takes the safe path. But when you want your library play A game you need to help it a little. Enter the world of [`ConfigureAwait`][6] calls. This method takes one `bool` parameter called `continueOnCapturedContext`. With it you can set how the infrastructure will behave in respect to continuations queueing. When you put `true` there it's like the method is not there and the default behavior is used. But when you use `false` the continuation will run on whatever available thread pool thread. Why it matters? Sometimes you have method that contains multiple asynchronous calls and your method exposes the whole wrap. Example?

```csharp
Task MoveDataAsync(Stream from, Stream to)
{
	while (!IsEOF(from))
	{
		var data = await ReadDataAsync(from);
		DoSomethingWithData(data);
		await WriteDataAsync(to);
	}
}
```

When this method is called from UI the `DoSomethingWithData` will be processed by UI thread (simplifying the `SynchronizationContext` magic). Even if it's not - and shouldn't be - necessary. The code would run fine. But just not as fast as it could. A vs A- game.

Solution is easy. Use `ConfigureAwait(false)`.

```csharp
Task MoveDataAsync(Stream from, Stream to)
{
	while (!IsEOF(from))
	{
		var data = await ReadDataAsync(from).ConfigureAwait(false);
		DoSomethingWithData(data);
		await WriteDataAsync(to).ConfigureAwait(false);
	}
}
``` 

And you're fine. 

Sadly. You cannot change the default behavior on i.e. assembly level. Or for a whole method or class. You need to keep in your head that as long as you're in library mode you need to call `ConfigureAwait(false)`. Pretty easy to forgot.

#### Solution

Visual Studio is not going to help you with some magic squiggles. It does not know whether you want to continue on current context or not. But the hope is not lost. When the [Roslyn][7] got support for `await` I started small project that would help me keep my code in check. I call it [ConfigureAwaitChecker][8]. It's open source and _I'm happy to accept contributions_.

Currently it's a library and simple console app that surfaces the results (plus PowerShell script `Check-Dir.ps1` to call the app on bunch of files). But as the Roslyn offers now also diagnostics API to plug into Visual Studio it might evolve that way as well.

So what it does? Given the piece of code on input it tells you whether you have or you're missing `ConfigureAwait(false)` with your `await` clauses. But there's of course bunch of limitations (else the smart guys in compilers team would do it, right?). 

First it really needs to be `ConfigureAwait(false)`. Having `ConfigureAwait(FunctionThatAlwaysReturnsFalse())` for example will produce false error. It's kind of [halting problem][9]. The function call might be a simple wrap around `return false`, but also complicated chain of calls, maybe to other systems, that's not easy to evaluate. Maybe in the future I'll at least try to trace the calls for potential constant results.

Second. It really checks for `await` together with `ConfigureAwait(false)`. But you can do for example this.

```csharp
var awaitMe = await FooAsync().ConfigureAwait(false);
var result = await awaitMe;
```

And it's fine and correct as well. Again. It's something I might try to tackle in future versions.

And finally it doesn't know whether your code should have the `ConfigureAwait(false)` or not. It's your task to decide whether the reporter "error" is really an error or whether it's fine. Some brain labor needed. ;)  

That's some major hurdles. But I used it for about half a year and it helped me to find some calls I forgot (in my case mainly from prototyping).

If you want to see some code in action look at [`ConfigureAwaitChecker.Tests`][10] tests project.

[1]: http://msdn.microsoft.com/en-us/library/dd460717(v=vs.110).aspx
[2]: http://msdn.microsoft.com/en-us/library/hh156528.aspx
[3]: http://en.wikipedia.org/wiki/Continuation
[4]: http://msdn.microsoft.com/en-us/library/ms228963(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.synchronizationcontext(v=vs.110).aspx
[6]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.configureawait(v=vs.110).aspx
[7]: http://msdn.microsoft.com/en-us/vstudio/roslyn.aspx
[8]: http://github.com/cincuranet/ConfigureAwaitChecker
[9]: http://en.wikipedia.org/wiki/Halting_problem   
[10]: http://github.com/cincuranet/ConfigureAwaitChecker/tree/master/ConfigureAwaitChecker.Tests