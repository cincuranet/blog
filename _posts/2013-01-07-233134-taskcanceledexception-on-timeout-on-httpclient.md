---
title: "TaskCanceledException on timeout on HttpClient"
date: 2013-01-07T07:46:35Z
tags:
  - C#
  - Lessons learned
  - Multithreading/Parallelism/Asynchronous/Concurrency
category: none
layout: post
---
.NET Framework has a nice new class for all sort of <a href="http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol">HTTP</a> stuff called <a href="http://msdn.microsoft.com/en-us/library/system.net.http.httpclient.aspx">`HttpClient`</a> (interesting the name wasn't taken before :)). And because it's I/O related it has also bunch on `XxxAsync` methods to nicely fit into C# 5's `async`/`await`.

<!-- excerpt -->

So you might write code similar to this, based on experience based on previous "network" classes.

<pre class="brush:csharp">
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
</pre>

If you try to run it, you'll get unhandled exception, <a href="http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskcanceledexception.aspx">`TaskCanceledException`</a> to be precise. Yep, the timeout is not propagated as <a href="http://msdn.microsoft.com/en-us/library/system.timeoutexception.aspx">`TimeoutException`</a>, but as `TaskCanceledException`. It caught me off guard a little bit. The documentation for <a href="http://msdn.microsoft.com/en-us/library/system.net.http.httpclient.timeout.aspx">`Timeout` property</a> touches <a href="http://msdn.microsoft.com/en-us/library/system.threading.cancellationtokensource.aspx">`CancellationTokenSource`</a> and you can feel the steer to `TaskCanceledException`. But, still, could be mentioned explicitly, will not be that surprising. Or maybe my thinking was skewed.

This code then works correctly.

<pre class="brush:csharp">
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
</pre>
