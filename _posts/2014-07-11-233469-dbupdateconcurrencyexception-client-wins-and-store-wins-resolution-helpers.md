---
title: |
  DbUpdateConcurrencyException "client wins" and "store wins" resolution helpers
date: 2014-07-11T09:33:00Z
tags:
  - Entity Framework
layout: post
---
Whenever I'm dealing with [`DbUpdateConcurrencyException`][1] I don't what is "client wins" and "store wins" look like. I can at the end figure it out because I know how the `ObjectStateManager`/`ChangeTracker` works and I kind of know where I'm heading. But going slowly though IntelliSense isn't what I like to do.

<!-- excerpt -->

In the old days of [`ObjectContext`][2] and [`OptimisticConcurrencyException`][3] it was easy. All you've had to do was use [`RefreshMode`][4] and "refresh". But that's past. The `DbUpdateConcurrencyException` era is here I can't do anything about it. Except I actually can (if I skip the idea of beign stubborn and using `ObjectContext`). I can write myself helpers. :o)

```csharp
static class DbUpdateConcurrencyExceptionExtensions
{
	public static void ClientWins(this DbUpdateConcurrencyException exception)
	{
		var entry = exception.Entries.First();
		entry.OriginalValues.SetValues(entry.GetDatabaseValues());
	}

	public static async Task ClientWinsAsync(this DbUpdateConcurrencyException exception)
	{
		var entry = exception.Entries.First();
		entry.OriginalValues.SetValues(await entry.GetDatabaseValuesAsync().ConfigureAwait(false));
	}

	public static void StoreWins(this DbUpdateConcurrencyException exception)
	{
		var entry = exception.Entries.First();
		entry.Reload();
	}

	public static Task StoreWinsAsync(this DbUpdateConcurrencyException exception)
	{
		var entry = exception.Entries.First();
		return entry.ReloadAsync();
	}
}
```

Now as I wrote the implementation, basically twice, I think I've learned it enough that I don't need these anymore. :) Maybe it will help others while looking for these strategies.

[1]: http://msdn.microsoft.com/en-us/library/system.data.entity.infrastructure.dbupdateconcurrencyexception(v=vs.113).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.objects.objectcontext(v=vs.113).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.optimisticconcurrencyexception(v=vs.113).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.core.objects.refreshmode(v=vs.113).aspx