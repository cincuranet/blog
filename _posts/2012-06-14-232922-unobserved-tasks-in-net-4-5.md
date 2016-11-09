---
title: "Unobserved tasks in .NET 4.5"
date: 2012-06-14T10:45:17Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
When the [Task][1] and other related were introduced, there was behavior that informed you that you are possible doing something wrong. Yes, I'm talking about the exception being thrown from finalizer thread when your task completed as [Faulted][2] because of unhandled exception. I think this is absolutely correct behavior. If something as bas as unhandled exception happened I should take care of it no matter what. Because else I might corrupt some data or ... what's worse than corrupt data? ;)

In .NET 4.5 this behavior changed. The [async/await][3] brings some interesting considerations. Anyway. The above mentioned behavior was changed. Simply the exception is no longer thrown from finalizer. Good, bad? No matter what, _I_ rather want my application to crash than to run happily next few hours and corrupt more data and do more mess.

Try to run this simple application (outside debugger, with optimization turned on):

```csharp
Task t = Task.Factory.StartNew(() =>
	{
		Console.WriteLine("Task");
		throw new Exception();
		return 10;
	});
Thread.Sleep(1000);
GC.Collect();
GC.WaitForPendingFinalizers();
Thread.Sleep(1000);
Console.WriteLine("Done");
```

If you run it under .NET 4.0 you will get something like:

```text
Unhandled Exception: System.AggregateException: A Task's exception(s) were not observed either by Waiting on the Task or accessing its Exception property. As a result, the unobserved exception was rethrown by the finalizer thread. ---> System.Exception: Exception of type 'System.Exception' was thrown.
   at ...
   --- End of inner exception stack trace ---
   at System.Threading.Tasks.TaskExceptionHolder.Finalize()
```

Under .NET 4.5 it goes silently to `Done`. Bummer. If you have some opinion as I, you can luckily revert to the old behavior. Just add to you config into `runtime` section:

```xml
<ThrowUnobservedTaskExceptions enabled="true" />
```

Back on a safe side. Of course you can still use [TaskScheduler.UnobservedTaskException][4] event to be notified about unhandled exceptions from tasks, in case it happens (and it should not in 99,999% cases 8-)), no matter what settings you're using. It's just not that punch-me-into-face way with immediate process crash.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskstatus.aspx
[3]: http://msdn.microsoft.com/en-us/library/hh191443(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskscheduler.unobservedtaskexception.aspx