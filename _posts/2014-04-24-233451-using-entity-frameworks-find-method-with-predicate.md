---
title: "Using Entity Framework's Find method with predicate"
date: 2014-04-24T05:21:00Z
tags:
  - Entity Framework
  - LINQ
redirect_from: /id/233451/
category: none
layout: post
---
Today I spotted [`#efhelp`][1] [question on Twitter][2] about using [`Find`][3] method but with predicate.

<!-- excerpt -->

The `Find` method is smart. It first checks whether the record with given key(s) is present in current [`DbContext`][4] locally and if so it returns it. Else it sends the query into database and returns what database has. Sadly the method only accepts key(s), not a i.e. predicate.

But thanks to [`Local` property on `DbSet`][5] it's not that difficult to create similar behavior.

```csharp
public static IEnumerable<T> FindPredicate<T>(this DbSet<T> dbSet, Expression<Func<T, bool>> predicate) where T : class
{
	var local = dbSet.Local.Where(predicate.Compile());
	return local.Any()
		? local
		: dbSet.Where(predicate).ToArray();
}

public static async Task<IEnumerable<T>> FindPredicateAsync<T>(this DbSet<T> dbSet, Expression<Func<T, bool>> predicate) where T : class
{
	var local = dbSet.Local.Where(predicate.Compile());
	return local.Any()
		? local
		: await dbSet.Where(predicate).ToArrayAsync().ConfigureAwait(false);
}
```

The method first checks "local" source, if there's nothing - either the record(s) are really not in memory yet or the predicate doesn't match anything (2<sup>nd</sup> item is important to keep in mind) - it hits the database. For convenience I also included asynchronous version of the same method.

[1]: {{ site.address }}{% post_url 2013-10-13-233423-efhelp-hashtag-now-better-than-ever %}
[2]: https://twitter.com/pilotbob/status/459035141672009728
[3]: http://msdn.microsoft.com/en-us/library/gg696418.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext.aspx
[5]: http://msdn.microsoft.com/en-us/library/gg696248.aspx