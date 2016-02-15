---
title: "CountdownEvent example"
date: 2009-06-10T08:49:00Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/230555/
category: none
layout: post
---
Yesterday [I wrote][1] about new CountdownEvent class. But what's better than see some example of usage? ;-)

Below is pretty simple example of usage. You can see, it's very similar to work with array of i.e. [ManualResetEvent][2]. But you have also some handy methods and properties. For instance: [AddCount][3]/[TryAddCount][4] or [CurrentCount][5]. Very handy.

```csharp
class Program
{
		static void Main(string[] args)
		{
				using (CountdownEvent cde = new CountdownEvent(10))
				{
					for (int i = 0; i < cde.InitialCount; i++)
					{
							new Thread(new ParameterizedThreadStart(Dummy)).Start(cde);
							//ThreadPool.QueueUserWorkItem(new WaitCallback(Dummy), cde);
					}
					cde.Wait(2000);
					Console.WriteLine("Threads done in first 2 seconds: {0}.", cde.InitialCount - cde.CurrentCount);
					cde.Wait();
					Console.WriteLine("All threads done.");
				}
		}
		static void Dummy(object o)
		{
				Thread.Sleep(new Random().Next(5000));
				(o as CountdownEvent).Signal();
		}
}
```

As I said, the work is similar to work with array of ManualResetEvent, just packed into nicer cake. In fact, if you start ILDasm and look into the code you'll see, that's implemented very similarly. It's using [ManualResetEventSlim][6] (also new in .NET 4) internally to signal and smart work with [Interlocked class][7] do decrement (or increment) the number of signals received.

Do you like the class too?

[1]: {{ site.url }}{% post_url 2009-06-09-230550-countdownevent-class %}
[2]: http://msdn.microsoft.com/en-us/library/system.threading.manualresetevent.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.countdownevent.addcount(VS.100).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.countdownevent.tryaddcount(VS.100).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.countdownevent.currentcount(VS.100).aspx
[6]: http://msdn.microsoft.com/en-us/library/system.threading.manualreseteventslim(VS.100).aspx
[7]: http://msdn.microsoft.com/en-us/library/system.threading.interlocked.aspx
