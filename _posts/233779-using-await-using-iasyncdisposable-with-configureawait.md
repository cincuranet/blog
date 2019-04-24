---
title: |-
  Using await using (IAsyncDisposable) with ConfigureAwait
date: 2019-04-24T08:42:00Z
tags:
  - .NET Core
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
C# 8 is bringing asynchronous disposables via new [`IAsyncDisposable`][1] and although the basic concept is easy to grasp, other rules of `await`ing still apply here. And one of these is the usage of `ConfigureAwait` call.

<!-- excerpt -->

Let's take this simple class.

```csharp
class AwaitUsingConfigureAwaitTest: IAsyncDisposable
{
	public async ValueTask DisposeAsync()
	{
		await Task.CompletedTask;
	}

	public void Dummy() { }
}
```

The `DisposeAsync` is just dummy, you don't have to think about it here.

The `ConfigureAwait` extension method exists for `IAsyncDisposable`, thus it can be called inside the `await using`.

```csharp
async Task FooBar()
{
	await using (new AwaitUsingConfigureAwaitTest().ConfigureAwait(false))
	{
		test.Dummy();
	}
}
```

But doing it like this results in `error CS1061: 'ConfiguredAsyncDisposable' does not contain a definition for 'Dummy' and no accessible extension method 'Dummy' accepting a first argument of type 'ConfiguredAsyncDisposable' could be found (are you missing a using directive or an assembly reference?)`. Bummer. Yet we can find our way out... Simply by using an extra variable.

```csharp
async Task FooBar()
{
	var test = new AwaitUsingConfigureAwaitTest();
	await using (test.ConfigureAwait(false))
	{
		test.Dummy();
	}
}
```

Not as succinct as I'd like (not that `ConfigureAwait` is smooth either). But all is not lost. At the time of writing, the C# 8 isn't final yet, so at the end [compiler might do some magic for us][3].

[1]: https://source.dot.net/#System.Private.CoreLib/shared/System/IAsyncDisposable.cs,4f4bd6a091aeee8b
[2]: https://source.dot.net/#System.Private.CoreLib/shared/System/Threading/Tasks/TaskExtensions.cs,4fb149a851c809fb
[3]: https://github.com/dotnet/roslyn/issues/34953
