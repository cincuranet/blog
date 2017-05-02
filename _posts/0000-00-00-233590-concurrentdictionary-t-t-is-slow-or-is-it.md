---
title: |-
  ConcurrentDictionary<T, T> is slow. Or is it?
date: 2016-12-23T10:11:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - .NET
  - .NET Core
layout: post
---
On this year's [MS Fest][1] [Jarda Jirava][2] had a presentation about [Akka.Net][3]. I was interested in this topic, because the _actor model_ is one way (out if many - sadly no silver bullet yet) to tackle concurrency and parallelism problems. 

While showing some _actor_ demos there was a nice comparison with home made solutions. So you don't have to go to full framework to try thinking in _actors_. The demo was just storing some key and value into a _hashtable_. The hand made was first [using][4] just plain old [`Dictionary<int, int>`][6] with [`lock`][8]/[`Monitor`][9] and then [using][5] [`ConcurrentDictionary<int, int>`][7]. To mine (and Jarda's surprise too) the `ConcurrentDictionary<int, int>` was slower. So I started digging into it and looking for a reason. Because I was confident the `ConcurrentDictionary<int, int>` should be faster compared to only single `Monitor`.

<!-- excerpt -->

#### The test code

Based on the presentation code I extracted a simple test bench to play with. I focused on having as less moving parts as possible, to be able to exactly control what my code is doing. I ended up with this code.

```csharp
public class Test
{
	object _syncRoot;
	Dictionary<int, int> _monitorDictionary;
	ConcurrentDictionary<int, int> _concurrentDictionary;

	public Test()
	{
		_syncRoot = new object();
		_monitorDictionary = new Dictionary<int, int>();
		_concurrentDictionary = new ConcurrentDictionary<int, int>();
	}

	public void MonitorDictionary()
	{
		TestHelper(i =>
		{
			lock (_syncRoot)
			{
				_monitorDictionary[i] = i;
			}
		}, "Monitor");
	}

	public void ConcurrentDictionary()
	{
		TestHelper(i =>
		{
			_concurrentDictionary[i] = i;
		}, "Concurrent");
	}

	static void TestHelper(Action<int> test, string name)
	{
		Console.Write($"{name}:\t");
		var sw = Stopwatch.StartNew();
		Parallel.For(0, 40000000, test);
		Console.WriteLine(sw.Elapsed);
	}
}
```

I'm running it with optimizations turned on, without debugger attached and in 64-bits (this doesn't matter that much). Depending on your machine, number of iterations (thus number of items in hashtable) you'll get different numbers. But for sure the `Monitor` version will be way faster.

```text
Concurrent:     00:00:14.3312184
Monitor:        00:00:03.4833102
```

So why is this?

#### Thinking

Looking at the code, you clearly spot two interesting pieces. The code is adding unique keys to the dictionary. Thus there will be no updates of values and it will be just inserting new items. 

Also, there's nothing happening around. It's just adding the items as quickly as possible. Hammering the locking. That's far from regular case.

And finally, running the code shows that for _Monitor_ version the CPU is 100% used (all cores) while for the _Concurrent_ it isn't.

#### Reason

If you look at the [`TryAddInternal` method][10] of `ConcurrentDictionary<T, T>` you'll see it's using `Node` class to handle the items. So that means allocations.

Second clue is in [`GrowTable` method][11].  And it's doing quite a locking and shuffling of locks (and of course also the resizing).

It must be GC. I'm pretty sure. Let's test it. I'll use the _Diagnostic Tools_ window in Visual Studio.

![Process Memory and GC]({% include post_ilink post=page name="monitor_concurrent_gc.png" %})

Whoa. There's a lot of GC-ing happening. Theory confirmed. Then also running a profiler shows a hot spot in `GrowTable` method. As expected. We're adding a lot of items.

#### Solution

Well, there's really none. In this specific edge case the single, hand crafted, `Monitor` will beat the `ConcurrentDictionary<T, T>`. But is it really a problem for a real world application?

The items are unique and just added as quickly as possible. It could be some _list_ or _bag_ implementations (i.e. [`ConcurrentBag<T>`][12]) might behave better for our case.

#### Closer to the real world application?

> What if I modify the code that it's not only adding, but also updating items?

```csharp
public void MonitorDictionary()
{
	TestHelper(i =>
	{
		lock (_syncRoot)
		{
			_monitorDictionary[i % 10] = i;
		}
	}, "Monitor");
}

public void ConcurrentDictionary()
{
	TestHelper(i =>
	{
		_concurrentDictionary[i % 10] = i;
	}, "Concurrent");
}
```

Running the code with this modification gives me comparable results for both versions. Using then `i % 100` as the index makes the `ConcurrentDictionary<T, T>` clear winner.

> What if I do some processing around?

```csharp
public void MonitorDictionary()
{
	TestHelper(i =>
	{
		Processing();
		lock (_syncRoot)
		{
			_monitorDictionary[i] = i;
		}
	}, "Monitor");
}

public void ConcurrentDictionary()
{
	TestHelper(i =>
	{
		Processing();
		_concurrentDictionary[i] = i;
	}, "Concurrent");
}

static int Processing()
{
	var sum = 0;
	for (var i = 0; i < 4000; i++)
	{
		sum += i;
	}
	return sum;
}
```

This time the difference is not that significant (in real world it would depend on what is the `Processing` method doing and how long it takes). The locking is not hammered like crazy and the GC has a room to breathe.

#### Conclusion

During the presentation my guess was that there's some _false sharing_ and/or _trashing_ happening. I couldn't have been more wrong, as you can see from two modifications above. Testing concurrent performance with synthetic test is far from what the code will do in real, hence it's more than desired to run tests with as close to real setup as possible.

As usual with this deep stuff. It has been a joy - for me - to dig into this problem and to start connecting the dots. And then slightly modifying the code to get to expected or desired behavior.

[1]: https://www.ms-fest.cz/praha
[2]: http://jirava.net/
[3]: http://getakka.net/
[4]: https://github.com/jiravanet/Prezentace2016-AkkaNet/blob/master/src/AkkaPrez.App/Actors/BusinessActor.cs#L58
[5]: https://github.com/jiravanet/Prezentace2016-AkkaNet/blob/master/src/AkkaPrez.App/Actors/BusinessActor.cs#L117
[6]: https://msdn.microsoft.com/en-us/library/xfhwa508(v=vs.110).aspx
[7]: https://msdn.microsoft.com/en-us/library/dd287191(v=vs.110).aspx
[8]: https://msdn.microsoft.com/en-us/library/c5kehkcz.aspx
[9]: https://msdn.microsoft.com/en-us/library/system.threading.monitor(v=vs.110).aspx
[10]: https://github.com/dotnet/corefx/blob/master/src/System.Collections.Concurrent/src/System/Collections/Concurrent/ConcurrentDictionary.cs#L806
[11]: https://github.com/dotnet/corefx/blob/master/src/System.Collections.Concurrent/src/System/Collections/Concurrent/ConcurrentDictionary.cs#L1751
[12]: https://msdn.microsoft.com/en-us/library/dd381779(v=vs.110).aspx