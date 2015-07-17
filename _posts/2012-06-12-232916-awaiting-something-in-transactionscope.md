---
title: "Awaiting something in TransactionScope"
date: 2012-06-12T12:15:43Z
tags:
  - .NET
  - Best practice or not?
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/232916/
category: none
layout: post
---
I like asynchronous programming. The [Asynchronous Programming Model][1] and later [Task][2]s with [ContinueWith][3] offer great performance especially if no waiting and similar is used.

Although the [async/await][4] makes this very simple for 99% of cases, there's always 1% where you might hit the wall. With callbacks it was little bit obvious, because you wrote the code. Now the compiler is doing the hard work.

If you do something like:

```csharp
lock (SyncRoot)
{
	await FooBar.DoAsync();
}
```

You'll get nice error from compiler saying `The 'await' operator cannot be used in the body of a lock statement`. And it really makes sense. The lock will very likely provide wrong results under default rewriting work the compiler is doing (and doing it properly for [Monitor][5] class needs a lot of knowledge of what you're trying to achieve. What's not so clear is that with [TransactionScope][6] block (or similar construct) you're basically doing same stuff, just probably somewhere else in database.

So the compiler is completely OK with:

```csharp
using (TransactionScope ts = new TransactionScope())
{
	await FooBar.DoAsync();
}
```

But that's not what you might had in mind. Consider code like:

```csharp
static void Main(string[] args)
{
	Test();
}
static async void Test()
{
	Task t = FooAsync();
	Console.WriteLine("Other stuff");
	await t;
}
static async Task FooAsync()
{
	using (Test t = new Test())
	{
		Console.WriteLine("Before");
		await Task.Yield();
		Console.WriteLine("After");
	}
}
```

```csharp
class Test : IDisposable
{
	public void Dispose()
	{
		Console.WriteLine("Dispose");
	}
}
```

The result is correct (and expected, if you look at it closely):

```
Before
Other stuff
After
Dispose
```

But considering, that the _Other stuff_ **might** have some dependency in data being done in that transaction you **might** get wrong result.

So it's not always wrong, nor some gotcha in compiler. But think it through before using this construct.

[1]: http://msdn.microsoft.com/en-us/library/ms228963.aspx
[2]: msdn.microsoft.com/en-us/library/system.threading.tasks.task.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.continuewith.aspx
[4]: http://msdn.microsoft.com/en-us/library/hh191443(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.monitor.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.transactions.transactionscope.aspx