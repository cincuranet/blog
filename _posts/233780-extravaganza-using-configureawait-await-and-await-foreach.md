---
title: |-
  Extravaganza using ConfigureAwait, await and await foreach
date: 2019-04-26T07:49:00Z
tags:
  - .NET Core
  - C#
---
As I was writing [previous post][1] I got some idea to "nest" `await`s in the `using` definition and make it little bit confusing.

<!-- excerpt -->

Sadly, it didn't get much confusing, because C# is generally well designed language. This was my try.

```csharp
class Test : IAsyncDisposable
{
	public ValueTask DisposeAsync() => throw new NotImplementedException();

	public static Task<Test> CreateAsync() => throw new NotImplementedException();

	public async Task Foo()
	{
		await using (var x = await CreateAsync())
		{ }
	}
}
```

Interesting combination? Sure. Yet still clear what it does. Trying to put `ConfigureAwait` forces me to extract one `await` call outside, as I showed in [previous post][1], thus not much luck here.

```csharp
public async Task Foo()
{
	var t = await CreateAsync().ConfigureAwait(false);
	await using (var x = t.ConfigureAwait(false))
	{ }
}
```

But I'm not giving up. I can maybe abuse `await foreach`, [another new C# 8 feature, similar to `await using`][2]. With that I can abuse the `IAsyncAnumerable<T>` and wrap it into the `Task<T>` (and obviously that's weird thing to do).

```csharp
class Test
{
	public IAsyncEnumerable<Test> Get() => throw new NotImplementedException();
	public Task<IAsyncEnumerable<Test>> Get2() => throw new NotImplementedException();

	public async Task Foo()
	{
		await foreach (var item in Get().ConfigureAwait(false))
		{

		}
	}

	public async Task Foo2()
	{
		await foreach (var item in (await Get2().ConfigureAwait(false)).ConfigureAwait(false))
		{

		}
	}
}
```

The `Foo` method is regular `ConfigureAwait` usage like I described in [previous post][1]. But the `Foo2` is more odd - which is what I wanted -, because thanks to `ConfiguredCancelableAsyncEnumerable<T>` I can write it in "one line".

I should surely rather go back to work. Although as I'm finishing this post, I'll leave with something I rather not expand further... :)

```csharp
class Test : IAsyncDisposable
{
	public async Task Foo()
	{
		await using (var x = ConfigureAwait(false).ConfigureAwait(false).ConfigureAwait(false).ConfigureAwait(false).ConfigureAwait(false).ConfigureAwait(false))
		{ }
	}

	public Test ConfigureAwait(bool continueOnCapturedContext) => this;

	public ValueTask DisposeAsync() => throw new NotImplementedException();
}
```

[1]: {{ include "post_link" 233779 }}
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-8.0/async-streams