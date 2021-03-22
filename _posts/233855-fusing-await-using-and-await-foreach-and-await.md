---
title: |-
  Fusing await using and await foreach and await
date: 2021-03-22T18:29:00Z
tags:
  - C#
---
As I'm thinking about the `await using` and various usage patterns, my mind sometimes starts to wander into pieces like `Task<IAsyncDisposable>`, `Task<IAsyncEnumerable<T>>` and `Task<IAsyncEnumerable<IAsyncDisposable>>`. And how to wrap that into `await using` and `await foreach` making some confusing combinations. This is what I was playing with, don't expect anything specific.

<!-- excerpt -->

The starting point was this piece of code.

```csharp
public async Task Foo()
{
	await foreach (var item in await Test<int>())
	{ }
	static Task<IAsyncEnumerable<T>> Test<T>() => default;
}
```

The only interesting piece is the `Task<IAsyncEnumerable<T>>`. What would that represent? 🤔 The rest is just a combination of `await foreach` and `await` inside it.

That got me into next piece of code.

```csharp
public async Task Bar()
{
	await using var test = await Test();
	static Task<IAsyncDisposable> Test() => default;
}
```

Here, I'm trying to somehow fuse together the `await using` and `await` without extra stuff in the middle. 

Maybe I can skip the variable declaration and have only the `await` expression inside.

```csharp
public async Task Baz()
{
	await using await Test();
	static Task<IAsyncDisposable> Test() => default;
}
```

Sadly, this is invalid code. The correct way to write it would be...

```csharp
public async Task Baz()
{
	await using (await Test());
	static Task<IAsyncDisposable> Test() => default;
}
```

But the parentheses bring some order into it and that's not what I'm about at the moment.

Maybe I can create some crazy type and abuse that.

```csharp
public class Damn : IAsyncDisposable, IAsyncEnumerable<Damn>
{
	public ValueTask DisposeAsync() => default;
	public IAsyncEnumerator<Damn> GetAsyncEnumerator(CancellationToken cancellationToken = default) => default;
	public TaskAwaiter<Damn> GetAwaiter() => default;
}
```

This type allows me to write stuff like this.

```csharp
public async Task M(Damn damn) 
{
	await using (await await damn) 
		await foreach (var item in await await damn)
			await await item;
}
```

Which is bit weird, but the formatting kind of makes it easy to understand. Single line version looks bit more confusing.

```csharp
public async Task M(Damn damn) 
{
	await using (await await damn) await foreach (var item in await await damn) await await item;
}
```

Obviously with the `Damn` type I can keep "spinning".

```csharp
public async Task M(Damn damn) 
{
	await using (await await damn)
		await foreach (var item in await await damn)
			await using (await await item)
				await foreach (var _ in await await item)
					await await _;
}
```

But it's the same pattern being repeated, not really something different.

After that I got tired and stopped. Feel free to be inspired and share your crazy ideas.