---
title: |-
  TaskCanceledException on timeout on HttpClient
date: 2013-01-07T07:46:35Z
tags:
  - C#
  - Lessons learned
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
.NET Framework has a nice new class for all sort of [HTTP][1] stuff called [`HttpClient`][2] (interesting the name wasn't taken before :)). And because it's I/O related it has also bunch on `XxxAsync` methods to nicely fit into C# 5's `async`/`await`.

<!-- excerpt -->

So you might write code similar to this, based on experience based on previous "network" classes.

```csharp
var client = new HttpClient();
client.Timeout = TimeSpan.FromMilliseconds(200); //adjust based on your network
try
{
	var result = await client.GetStringAsync("http://blog.cincura.net/");
}
catch (HttpRequestException)
{
	// handle somehow
	Console.WriteLine("HttpRequestException");
}
catch (TimeoutException)
{
	// handle somehow
	Console.WriteLine("TimeoutException");
}
```

If you try to run it, you'll get unhandled exception, [`TaskCanceledException`][3] to be precise. Yep, the timeout is not propagated as [`TimeoutException`][4], but as `TaskCanceledException`. It caught me off guard a little bit. The documentation for [`Timeout` property][5] touches [`CancellationTokenSource`][6] and you can feel the steer to `TaskCanceledException`. But, still, could be mentioned explicitly, will not be that surprising. Or maybe my thinking was skewed.

This code then works correctly.

```csharp
var client = new HttpClient();
client.Timeout = TimeSpan.FromMilliseconds(200);
try
{
	var result = await client.GetStringAsync("http://blog.cincura.net/");
}
catch (HttpRequestException)
{
	// handle somehow
	Console.WriteLine("HttpRequestException");
}
//catch (TimeoutException)
//{
//	// handle somehow
//	Console.WriteLine("TimeoutException");
//}
catch (TaskCanceledException)
{
	// handle somehow
	Console.WriteLine("TaskCanceledException");
}
```

[1]: http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
[2]: http://msdn.microsoft.com/en-us/library/system.net.http.httpclient.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskcanceledexception.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.timeoutexception.aspx
[5]: http://msdn.microsoft.com/en-us/library/system.net.http.httpclient.timeout.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.threading.cancellationtokensource.aspx