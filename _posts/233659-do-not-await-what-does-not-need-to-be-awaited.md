---
title: |-
  Do not await what does not need to be awaited
date: 2017-11-17T17:28:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
As the usage of `await` seeps more and more into general C# code, I'm finding some small "leaks" that make me sad sometimes. This one is pretty simple. Looks like that every time somebody uses `XxxAsync` method, he or she also awaits it. Makes sense, or does it?

<!-- excerpt -->

#### The problem

Obviously if you need the result of an asynchronous action you'd use `await`. But if you're just passing the value up, the `await` is just a complication for the compiler, because more code is generated, and for JIT/runtime, because more code is executed. Let me show some example.

Granted there's some interface (because that's where I see it often).

```csharp
interface ISomething
{
	Task<string> GetSomethingAsync();
}
```

And you implement it (i.e. using some service).

```csharp
public class Something : ISomething
{
	readonly IService _service;

	public Something(IService service)
	{
		_service = service;
	}

	public async Task<string> GetSomethingAsync() => await _service.FetchSomethingAsync();
}
```

Nothing wrong, right?

Absolutely. The code is fine and works as expected. But that doesn't mean something cannot be improved. The `await _service.FetchSomethingAsync()` expression forces compiler to create the _state machine_ that's behind this feature. And this code is not exactly small (see below for numbers).

#### The solution

In these cases, it's easier to just pass the task higher directly. So, the class can look like this then.

```csharp
public class Something : ISomething
{
	readonly IService _service;

	public Something(IService service)
	{
		_service = service;
	}

	public Task<string> GetSomethingAsync() => _service.FetchSomethingAsync();
}
```

With this nothing is generated and it's just a regular method call.

#### The gotchas

There's at least one gotcha I know people are surprised when they think about this for the first time. Take the following method.

```csharp
public async Task FooBar()
{
	using (var foo = new Foo())
	{
		await SomethingAsync(foo);
	}
}
```

Can this be rewritten the way I showed before?

No! When you swap the `async`/`await` for plain `return`, the code will go over the `finally` block (from `using`) and will dispose the `Foo`, but the `SomethingAsync` might be still running and using it. _Queue dramatic explosion._

#### Some numbers

All the above is a theory which can or not translate into some real hard cold numbers in the runtime. Benchmark time (using [BenchmarkDotNet][1]).

First, let's check code size of resulting binary. Bare metal `netcoreapp2.0` console application having just one extra class with one asynchronous method is `6144` vs `5632` bytes on disk. OK, I agree not exactly a deal breaker, especially considering today's storage prices. Where does the difference come from? Well, it's from the generated _state machine_.

```csharp
[CompilerGenerated]
[StructLayout(LayoutKind.Auto)]
private struct <Do>d__0 : IAsyncStateMachine
{
	public int <>1__state;
	public AsyncTaskMethodBuilder <>t__builder;
	private ConfiguredTaskAwaitable.ConfiguredTaskAwaiter <>u__1;

	void IAsyncStateMachine.MoveNext()
	{
		int num = this.<>1__state;
		try
		{
			ConfiguredTaskAwaitable.ConfiguredTaskAwaiter awaiter;
			if (num != 0)
			{
				awaiter = Task.Delay(1000).ConfigureAwait(false).GetAwaiter();
				if (!awaiter.get_IsCompleted())
				{
					this.<>1__state = 0;
					this.<>u__1 = awaiter;
					this.<>t__builder.AwaitUnsafeOnCompleted<ConfiguredTaskAwaitable.ConfiguredTaskAwaiter, Test.<Do>d__0>(ref awaiter, ref this);
					return;
				}
			}
			else
			{
				awaiter = this.<>u__1;
				this.<>u__1 = default(ConfiguredTaskAwaitable.ConfiguredTaskAwaiter);
				this.<>1__state = -1;
			}
			awaiter.GetResult();
		}
		catch (Exception exception)
		{
			this.<>1__state = -2;
			this.<>t__builder.SetException(exception);
			return;
		}
		this.<>1__state = -2;
		this.<>t__builder.SetResult();
	}

	[DebuggerHidden]
	void IAsyncStateMachine.SetStateMachine(IAsyncStateMachine stateMachine)
	{
		this.<>t__builder.SetStateMachine(stateMachine);
	}
}
```

And as my trusty [ILSpy][2] shows `// Code size 156 (0x9c)`. Does this affect the speed of execution or allocations?

I first tested _fast path_ scenario, where the awaited task has already completed, using `Task.CompletedTask`.

|               Method |      Mean |     Error |    StdDev | Scaled | ScaledSD | Allocated |
|--------------------- |----------:|----------:|----------:|-------:|---------:|----------:|
| WithoutAwaitFastPath |  1.418 ns | 0.0237 ns | 0.0221 ns |   1.00 |     0.00 |       0 B |
|    WithAwaitFastPath | 23.269 ns | 0.0503 ns | 0.0471 ns |  16.42 |     0.25 |       0 B |

Well, that's quite a difference. Going through the `await` and _state machine_ in this _fast path_ scenario isn't cheap.

Next, I tested a call where some callback really happens. I used `Task.Delay(1)`, thus don't look at absolute numbers, but only at the difference.

|       Method |     Mean |     Error |    StdDev | Scaled | Allocated |
|------------- |---------:|----------:|----------:|-------:|----------:|
| WithoutAwait | 15.62 ms | 0.0085 ms | 0.0079 ms |   1.00 |     312 B |
|    WithAwait | 15.62 ms | 0.0096 ms | 0.0089 ms |   1.00 |     528 B |

The execution speed here is the same because the execution itself is fully overruled by the duration of the asynchronous method itself (in this case the timer callback), as it should be. But there's a `216` bytes difference in allocation (.NET Core 2.0.3, 64-bit RyuJIT). Does it matter? In normal code probably not. But why to give something out when the "fix" is super easy and clean.

#### Summary

Was this just my rambling about a problem that in real world doesn't matter that much? Yes, it was. Although sometimes I really need to connect the smallest dots and every clue matters.

And you don't write `array[index + 0]`, why would you do the `+ 0` with an extra `await`...

[1]: http://benchmarkdotnet.org/
[2]: http://ilspy.net/