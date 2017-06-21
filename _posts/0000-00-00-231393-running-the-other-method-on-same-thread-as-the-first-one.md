---
title: |-
  Running the other method on same thread as the first one
date: 2010-06-06T21:31:56Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Last week I was solving problem. The piece of code another code was plugged in was doing some crazy threading stuff inside while the code plugged in used some component that needed some methods (in my case just two) to be called in same thread. Well, that is to make the long story short.

As I couldn't rely on the fact, that the thread calling the first method will be still available when the other one needs to be called I decided to simply steal one thread (in fact [ThreadPool][1] thread) for it a abuse it exclusively. To encapsulate this hack I created this class.

<small>Before you dive into, I have to note, that it is really not a general purpose class and you shouldn't blindly use it - you can easily use it badly and i.e. create unwanted shared state, screw the flow of your program or get wrong results due race conditions, ...</small>

```csharp
/// <summary>
/// This is NOT a general purpose class.
/// Use with care.
/// </summary>
sealed class ThreadMethodRunner : IDisposable
{
	AutoResetEvent _eventMethodDone;
	AutoResetEvent _eventMethodIn;
	Action _method;
	public ThreadMethodRunner()
	{
		_eventMethodDone = new AutoResetEvent(false);
		_eventMethodIn = new AutoResetEvent(false);
		ThreadPool.QueueUserWorkItem(new WaitCallback(MethodRunnerWrapper), null);
	}
	private void MethodRunnerWrapper(object o)
	{
		for (int i = 0; i < 2; i++)
		{
			Debug.WriteLine("Waiting for method");
			_eventMethodIn.WaitOne();
			Action a = Interlocked.Exchange(ref _method, null) as Action;
			a();
			Debug.WriteLine("Method done");
			_eventMethodDone.Set();
		}
		Debug.WriteLine("Thread done");
	}
	public void Do(Action method)
	{
		Interlocked.Exchange(ref _method, method);
		_eventMethodIn.Set();
		_eventMethodDone.WaitOne();
	}
	public void Dispose()
	{
		_eventMethodDone.Dispose();
		_eventMethodIn.Dispose();
	}
}
```

This class allows you to call the `Do` method with [Action delegate][2] and the method will run the code on the same thread every time (in my case just two times) called. This method blocks as you probably want to keep the behavior of you old code (at least in boundaries of method calls order, not changing some state etc. as mentioned above).

I don't know if it's worth any other usage than mine, but at least somebody may be inspired.

[1]: http://msdn.microsoft.com/en-us/library/4yd16hza.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.action.aspx