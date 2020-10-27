---
title: |-
  How Entity Framework Core's query cache works
date: 2020-10-27T12:58:00Z
tags:
  - Entity Framework Core
---
Last week, when [speaking at .NET Developer Days][2], I got a question about the query cache in Entity Framework Core - is it shared across `DbContext`s or is it per instance? With this question I realized I know how the cache work(ed) in Entity Framework 6, but I'm not entirely sure how it's done in Entity Framework Core. Time to explore! And you can go with me.

<!-- excerpt -->

Let's do some basic thinking first. Does it make sense to have query cache across instances? For the same `DbContext` type and hence same model (`IModel`) for sure. Could it be useful for different `DbContext`s? Maybe. Probably not. Although you can have, i.e. when using _bounded contexts_, `DbContext`s with overlap, the query would have to use only the overlapping part of the model and the cache would have to be able to work on fine granularity.

I'll try to figure out the result only searching file names, types, content and reading pieces of code. Here we go.

The query cache should be in some file containing _query_ and _cache_ in its name, right? Luckily there's a `CompiledQueryCache.cs`. Nice, there's a `IMemoryCache` being used and the description states it is a _singleton_. And the `GetOrAddQuery` method already has the _key_ as an input argument. This comes from `QueryCompiler` class and `ICompiledQueryCacheKeyGenerator.GenerateCacheKey` is used. The `CompiledQueryCacheKeyGenerator` is the implementation of that interface and it just returns instance of `CompiledQueryCacheKey`, which is defined as `protected readonly struct CompiledQueryCacheKey : IEquatable<CompiledQueryCacheKey>`. Cool. The equality is implemented as follows.

```csharp
public bool Equals(CompiledQueryCacheKey other)
{
    return ReferenceEquals(_model, other._model)
        && _queryTrackingBehavior == other._queryTrackingBehavior
        && _async == other._async
        && ExpressionEqualityComparer.Instance.Equals(_query, other._query);
}

public override int GetHashCode()
{
    var hash = new HashCode();
    hash.Add(_query, ExpressionEqualityComparer.Instance);
    hash.Add(_model);
    hash.Add(_queryTrackingBehavior);
    hash.Add(_async);
    return hash.ToHashCode();
}
```

OK, so it's checking the selected [_tracking_ behavior][1], whether it's _async_ and finally the model plus query. The `ExpressionEqualityComparer` and specifically the `ExpressionComparer` seems to be checking whether the "structure" of the query is the same. Makes sense, the _canonical_ version of the query is very likely done in another place. That leaves us only with `ReferenceEquals(_model, other._model)`.

Clearly this is comparing references, hence the question is whether the model (`IModel`) is somewhat cached between instances too. Again, probably the file is gonna have _model_ and _cache_ in its name. And there seems to be `IModelCacheKeyFactory` where the implementation `ModelCacheKeyFactory` is using just `ModelCacheKey`. And this class has a nice comment.

```csharp
///         A key that uniquely identifies the model for a given context. This is used to store and lookup
///         a cached model for a given context. This default implementation uses the context type as they key, thus
///         assuming that all contexts of a given type have the same model.
```

So, the `Type` of `DbContext` is used for equality comparisons.

And here you have it. When everything is put together, we can infer the query cache is using `IMemoryCache` as an implementation, it's a _singleton_ (aka shared across everything in Entity Framework Core) and caching key ultimately depends on the model, which is the same across same `DbContext`s. 

[1]: https://docs.microsoft.com/en-us/ef/core/querying/tracking
[2]: {{ include "post_link" 233837 }}