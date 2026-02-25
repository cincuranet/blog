---
title: |-
  Surprising cost of synchronous fast-paths in asynchronous methods
date: 2021-08-05T08:18:00Z
tags:
  - .NET
  - C#
  - Async
  - Performance
  - Programming in general
---
I'm doing some performance related work in async space, and I was surprised by the slowness of synchronous code-paths in the asynchronous methods. Let's look at some code.

<!-- excerpt -->

The best-case scenario for fast-path is that you don't have any `await` in the call chain. Something like this.

```csharp
public Task<FooBar> Foo() => Bar();
public Task<FooBar> Bar() => Baz();
public Task<FooBar> Baz() => Task.FromResult(new FooBar());
```

Worse scenario is when you need to include some `await` (i.e., because of `using`).

```csharp
public async Task<FooBar> Foo() => await Bar();
public async Task<FooBar> Bar() => await Baz();
public Task<FooBar> Baz() => Task.FromResult(new FooBar());
```

You can now pause and guess what the cost of the first example and second example is going to be compared to "normal" call. The first one should be more or less the same, right? There's nothing specific to `async`/`await`. Just method calls. And what about `ValueTask`? And does the length of chain matter?

To get the answers I designed this benchmark.

```csharp
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
//using TestDataType = System.Boolean;
//using TestDataType = System.Decimal;
using TestDataType = System.String;

[MemoryDiagnoser, DisassemblyDiagnoser]
public class Test
{
	//public const TestDataType Result = true;
	//public const TestDataType Result = 1234.567m;
	public const TestDataType Result = "foobar";

	A _a;
	B _b;
	C _c;
	D _d;
	E _e;

	[GlobalSetup]
	public void GlobalSetup()
	{
		_a = new();
		_b = new();
		_c = new();
		_d = new();
		_e = new();
	}

	[Params(true, false)]
	public bool Deep { get; set; }

	[Benchmark(Baseline = true)]
	public TestDataType DirectCall()
	{
		return Deep
			? _a.Do(_b, _c, _d, _e)
			: _e.Do();
	}

	[Benchmark]
	public TestDataType DirectPathWithTask()
	{
		return Deep
			? _a.DoTask(_b, _c, _d, _e).GetAwaiter().GetResult()
			: _e.DoTask().GetAwaiter().GetResult();
	}

	[Benchmark]
	public async Task<TestDataType> AwaitPathWithTask()
	{
		return Deep
			? await _a.DoAwaitTask(_b, _c, _d, _e)
			: await _e.DoAwaitTask();
	}

	[Benchmark]
	public TestDataType DirectPathWithValueTask()
	{
		return Deep
			? _a.DoValueTask(_b, _c, _d, _e).GetAwaiter().GetResult()
			: _e.DoValueTask().GetAwaiter().GetResult();
	}

	[Benchmark]
	public async ValueTask<TestDataType> AwaitPathWithValueTask()
	{
		return Deep
			? await _a.DoAwaitValueTask(_b, _c, _d, _e)
			: await _e.DoAwaitValueTask();
	}
}

class A
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public TestDataType Do(B b, C c, D d, E e) => b.Do(c, d, e);
	public Task<TestDataType> DoTask(B b, C c, D d, E e) => b.DoTask(c, d, e);
	public async Task<TestDataType> DoAwaitTask(B b, C c, D d, E e) => await b.DoAwaitTask(c, d, e);
	public ValueTask<TestDataType> DoValueTask(B b, C c, D d, E e) => b.DoValueTask(c, d, e);
	public async ValueTask<TestDataType> DoAwaitValueTask(B b, C c, D d, E e) => await b.DoAwaitValueTask(c, d, e);
}
class B
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public TestDataType Do(C c, D d, E e) => c.Do(d, e);
	public Task<TestDataType> DoTask(C c, D d, E e) => c.DoTask(d, e);
	public async Task<TestDataType> DoAwaitTask(C c, D d, E e) => await c.DoAwaitTask(d, e);
	public ValueTask<TestDataType> DoValueTask(C c, D d, E e) => c.DoValueTask(d, e);
	public async ValueTask<TestDataType> DoAwaitValueTask(C c, D d, E e) => await c.DoAwaitValueTask(d, e);
}
class C
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public TestDataType Do(D d, E e) => d.Do(e);
	public Task<TestDataType> DoTask(D d, E e) => d.DoTask(e);
	public async Task<TestDataType> DoAwaitTask(D d, E e) => await d.DoAwaitTask(e);
	public ValueTask<TestDataType> DoValueTask(D d, E e) => d.DoValueTask(e);
	public async ValueTask<TestDataType> DoAwaitValueTask(D d, E e) => await d.DoAwaitValueTask(e);
}
class D
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public TestDataType Do(E e) => e.Do();
	public Task<TestDataType> DoTask(E e) => e.DoTask();
	public async Task<TestDataType> DoAwaitTask(E e) => await e.DoAwaitTask();
	public ValueTask<TestDataType> DoValueTask(E e) => e.DoValueTask();
	public async ValueTask<TestDataType> DoAwaitValueTask(E e) => await e.DoAwaitValueTask();
}
class E
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public TestDataType Do() => Test.Result;
	public Task<TestDataType> DoTask() => Task.FromResult(Test.Result);
	public async Task<TestDataType> DoAwaitTask() => await Task.FromResult(Test.Result);
	public ValueTask<TestDataType> DoValueTask() => ValueTask.FromResult(Test.Result);
	public async ValueTask<TestDataType> DoAwaitValueTask() => await ValueTask.FromResult(Test.Result);
}
```

First thing to mention is the usage of `TestDataType` "alias" to test with different datatypes - `bool` as something that has known set of values, `decimal` for a value type and `string` for a reference type. And although the numbers very slightly, the overall result is always the same.

The `Deep` parameter controls the length of the chain - either calling the terminal methods on `E` directly or going through `A`, `B`, `C`, `D` respectively. 

The `Do` method is using the `NoInlining` flag to level the playing field a bit, because usually in real world the method will not be that simple and hence probably not worth inlining.

The rest is just the benchmark testing `Task` and `ValueTask` in scenarios I outlined above.

Here's the results.

|                  Method |  Deep |        Mean |     Error |    StdDev |  Ratio | RatioSD |  Gen 0 | Gen 1 | Gen 2 | Allocated | Code Size |
|------------------------ |------ |------------:|----------:|----------:|-------:|--------:|-------:|------:|------:|----------:|----------:|
|              DirectCall | False |   0.4399 ns | 0.0064 ns | 0.0060 ns |   1.00 |    0.00 |      - |     - |     - |         - |      87 B |
|      DirectPathWithTask | False |   6.4300 ns | 0.2099 ns | 0.5781 ns |  13.94 |    1.34 | 0.0043 |     - |     - |      72 B |     219 B |
|       AwaitPathWithTask | False |  28.8549 ns | 0.1742 ns | 0.1630 ns |  65.60 |    1.06 | 0.0129 |     - |     - |     216 B |     376 B |
| DirectPathWithValueTask | False |   8.8030 ns | 0.0031 ns | 0.0028 ns |  19.98 |    0.25 |      - |     - |     - |         - |     511 B |
|  AwaitPathWithValueTask | False |  50.6709 ns | 0.1732 ns | 0.1535 ns | 115.00 |    1.47 |      - |     - |     - |         - |     900 B |
|              DirectCall |  True |   6.2216 ns | 0.0131 ns | 0.0122 ns |   1.00 |    0.00 |      - |     - |     - |         - |     118 B |
|      DirectPathWithTask |  True |   6.3206 ns | 0.1992 ns | 0.5872 ns |   1.07 |    0.10 | 0.0043 |     - |     - |      72 B |     219 B |
|       AwaitPathWithTask |  True |  94.6696 ns | 0.2804 ns | 0.2486 ns |  15.22 |    0.05 | 0.0300 |     - |     - |     504 B |     376 B |
| DirectPathWithValueTask |  True |   9.8505 ns | 0.2449 ns | 0.3433 ns |   1.58 |    0.06 |      - |     - |     - |         - |     511 B |
|  AwaitPathWithValueTask |  True | 138.4892 ns | 0.2050 ns | 0.1601 ns |  22.26 |    0.05 |      - |     - |     - |         - |     900 B |

Run with this setup.

```text
BenchmarkDotNet=v0.13.0, OS=Windows 10.0.19043.1110 (21H1/May2021Update)
AMD Ryzen 7 5800X, 1 CPU, 16 logical and 8 physical cores
.NET SDK=5.0.302
  [Host]     : .NET 5.0.8 (5.0.821.31504), X64 RyuJIT
  DefaultJob : .NET 5.0.8 (5.0.821.31504), X64 RyuJIT
```

For a short call chain, the direct call beats both direct call with `Task` as well as direct call with `ValueTask`. Once the chain is longer the difference between direct calls and `Task` smooths out. The `ValueTask` is still losing a bit (more about that later).

When you put `await` (and hence state machines) into the mix, the difference is enormous, even for short call chains. That means you can't simply do this as a fast-path.

```csharp
public async ValueTask<FooBar> Foo()
{
	if (FastPath)
		return Bar();
	return await BarAsync();
}
```

Finally, you might be wondering why the `ValueTask` versions are consistently slower than `Task` versions. Shouldn't it be faster, especially in fast-paths? Yes. But not in this simple sequential benchmark. The `Task` is quickly allocated and then collected from _Gen 0_, which is fairly cheap.  Also, the code for `ValueTask` is bigger (_Code Size_ column) with more stuff happening - bigger structure, more copying, runtime checks around `null`, `IValueTaskSource<T>` and even `Task<T>`. But once you put bit more pressure onto GC, for example in highly concurrent scenarios (you can try that with simple `Parallel.For` in _DirectPathWithTask_ and _DirectPathWithValueTask_), the numbers flip in favor of `ValueTask`.

#### Summary

Doing synchronous fast-paths is not as straightforward as it may look. When considering fast-path any `await` in call chains must be avoided as much as possible. And even then, it's not blindly equal to "normal" method call with `int`, `decimal`, or ... Then one needs to consider usage of `ValueTask` over `Task` regarding concurrency and GC pressure.