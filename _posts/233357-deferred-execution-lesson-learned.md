---
title: |-
  Deferred execution - lesson learned
date: 2016-04-12T18:45:00Z
tags:
  - C#
  - .NET
  - LINQ
  - Lessons learned
---
Today was a refactoring day. Well half of it. I was in correct mood. And I was bitten by old code and my own ignorance of deferred execution for enumerables.

<!-- excerpt -->

I was refactoring `ForEach` extension method on `IEnumerable<T>` interface. The signature was `void ForEach<T>(this IEnumerable<T> source, Action<T> action)`. You probably know what it did. Right next to it was method `IEnumerable<T> ForEachFluent<T>(this IEnumerable<T> source, Action<T> action)`, with pretty similar body. Simplified it could look like this.

```csharp
public static void ForEachA<T>(this IEnumerable<T> source, Action<T> action)
{
    foreach (var item in source)
    {
        action.Invoke(item);
    }
}

public static IEnumerable<T> ForEachB<T>(this IEnumerable<T> source, Action<T> action)
{
    foreach (var item in source)
    {
        action.Invoke(item);
        yield return item;
    }
}
```

It was calling for merging. The first one is basically just throwing away the result, isn't it? I can call the second one there. Or can I? Here's a simple test.

```csharp
class Program
{
    static void Main(string[] args)
    {
        var dataA = new[] { new Foo(), new Foo(), new Foo() };
        var dataB = new[] { new Foo(), new Foo(), new Foo() };
        dataA.ForEachA(x => x.Bar = true);
        dataB.ForEachB(x => x.Bar = true);
        Console.WriteLine(string.Join<Foo>(", ", dataA));
        Console.WriteLine(string.Join<Foo>(", ", dataB));
    }
}

class Foo
{
    public bool Bar { get; set; }
    public override string ToString() => Bar.ToString();
}
```

Running it gives this.

```text
True, True, True
False, False, False
```

It may look obvious now, given the post's title. But I'm telling you I was confused. I even fired up `ildasm` and started hunting. I was so sure it's some deep, weird C# behavior. Obviously it isn't. The `ForEachB` is turned into enumerator and until somebody really goes through it, nothing is executed - deferred execution at it's best (more detailed info [here][1] or [here][2]). Silly me.

Of course I can merge these together, but the `ForEachA` (or the `ForEach` in original code) needs to _just_ really iterate over the result of `ForEachB`. Next time I'll first try to do some basic debugging, before diving straight into IL. Lesson learned.

[1]: https://blogs.msdn.microsoft.com/charlie/2007/12/10/linq-and-deferred-execution/
[2]: https://msdn.microsoft.com/en-us/library/bb669162.aspx