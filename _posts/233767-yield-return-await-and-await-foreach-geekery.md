---
title: |-
  yield return await and await foreach geekery
date: 2019-01-29T07:50:00Z
tags:
  - C#
  - Roslyn
---
This is just a pure geekery, but as I was playing with [_asynchronous enumerables_][2] I realized I can combine the `await` and `yield return` together. In fact, I can even throw `await foreach` into the mix.

<!-- excerpt -->

Thus, this code (completely useless) is compiled without the compiler complaining.

```csharp
async IAsyncEnumerable<int> FooBarAsync()
{
	await foreach (var n in FooBarAsync())
	{
		yield return await Task.FromResult(n);
	}
}
```

Why is this so interesting that I'm writing about it? Well, thinking about what's going on behind makes me giggle a bit (I know it's just a machine producing code, but still...geek).

Let's start from the inside. The `await` produces one state machine, because that's how the [_couroutine_][1] is internally represented. Then the `yield return` which is the same story. And finally, the `await foreach` that works on the `MoveNextAsync` of the async enumerator. To take it from other direction, the code calls top-level `FooBarAsync` and hits the first iteration of `await foreach`, that asynchronously waits for the `MoveNextAsync` to complete and goes to produce the result in `yield return`, which the caller is going to consume. But before that happens the `await` after the `yield return` needs to complete. Only now the caller can continue.

Also having `yield return await`, three keywords, together is not that usual (although one can come up with various other ways to have three (or more) keywords, declarations excluded, together).

[1]: https://en.wikipedia.org/wiki/Coroutine
[2]: https://github.com/dotnet/roslyn/issues/261