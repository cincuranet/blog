---
title: |-
  Simple caching interceptor (aspect) for Castle Windsor
date: 2018-04-23T14:48:00Z
tags:
  - .NET
  - Aspect Oriented Programming (AOP)
  - Caching
  - Castle Windsor
  - Inversion of Control (IoC)
---
I needed to cache value from method. Simple. I know there's at least dozen of ready-made solutions, but I eventually decided to write my own _interceptor_, because the whole project is already using Castle Windsor and it seemed like a fun stuff to explore. There isn't really anything special about this code and I originally didn't want to blog about it, but [people on Twitter changed my mind][1].

<!-- excerpt -->

#### Attribute

First, I wrote an attribute I will use to mark methods where the caching is active so I don't have to hardcode that into the interceptor. There's optional property to specify how long the value should be cached.

```csharp
[AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public sealed class CachedAttribute : Attribute
{
    public int Minutes { get; set; }
}
```

#### Aspect

The interceptor, or _aspect_ as I think about it, needs to somehow create a key to get or store the return value. I simply use type name, method name and all arguments (converted to string) glued together with some separators. It's not absolutely bulletproof, but it's good enough and I know I can always refactor methods to fit this. Surely easier than trying to have perfect key generation story.

Once I have the key, I look up the cache value and either set `ReturnValue`, never calling `Proceed` hence never really executing the or `Proceed`ing (See what I did? ;)) as usual and then storing the return value into the cache.

```csharp
public sealed class CachingAspect : IInterceptor
{
    sealed class Item
    {
        public object Value { get; }

        public Item(object value)
        {
            Value = value;
        }
    }

    public void Intercept(IInvocation invocation)
    {
        var cacheAttribute = invocation.MethodInvocationTarget.GetAttribute<CachedAttribute>();
        if (cacheAttribute == null)
        {
            invocation.Proceed();
            return;
        }

        var typeName = invocation.TargetType.FullName;
        var methodName = invocation.Method.Name;
        var arguments = string.Join("|", invocation.Arguments);
        var cacheKey = string.Join("_", typeName, methodName, arguments);
        if (MemoryCache.Default.Get(cacheKey) is Item cache)
        {
            invocation.ReturnValue = cache.Value;
        }
        else
        {
            invocation.Proceed();
            MemoryCache.Default.Add(cacheKey, new Item(invocation.ReturnValue), ComputeExpiration(cacheAttribute));
        }
    }

    static DateTimeOffset ComputeExpiration(CachedAttribute cacheAttribute)
    {
        var minutes = cacheAttribute.Minutes;
        if (minutes < 1)
        {
            minutes = 5;
        }
        return DateTimeOffset.UtcNow.Add(TimeSpan.FromMinutes(minutes));
    }
}
```

The caching itself is done by using `MemoryCache` and storing the `Item` class (for some reason I don't use `CacheItem`, but I don't remember why; all I recall is I had some trouble using it).

#### Possible future work

That's really it. Nothing fancy and it just works. But there's stuff one could add to make it nicer. Some of my mental notes are dumped below.

* Handle multithreading? Locking?
* Exceptions caching?
* Injectable cache implementation.
* Better cache keys.

[1]: https://twitter.com/cincura_net/status/966783358993948672