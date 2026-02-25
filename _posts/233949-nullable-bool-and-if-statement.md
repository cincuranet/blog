---
title: |-
  Nullable bool and if statement
date: 2025-05-16T11:00:00Z
tags:
  - .NET
  - C#
---
I was writing some code in EF Core's codebase and saw different way of writing condition on nullable bool.

<!-- excerpt -->

The condition was written as:

```csharp
if (FooBar() == true)
{
    Console.WriteLine("Test");
}
bool? FooBar() => default;
```

Which kind of surprised me, because I usually write it as:

```csharp
if (FooBar() ?? false)
{
    Console.WriteLine("Test");
}
bool? FooBar() => default;
```

Both get the job done, but it got me thinking... What if one is better/faster than the other? Time to investigate.

But, both result in exactly the same IL and hence there's no benefit of using one over the other.

```csharp
using System;

if (FooBar() == true)
{
    Console.WriteLine("Test");
}
if (FooBar() ?? false)
{
    Console.WriteLine("Test");
}
bool? FooBar() => default;
```

```text
[CompilerGenerated]
internal class Program
{
    private static void <Main>$(string[] args)
    {
        if (<<Main>$>g__FooBar|0_0().GetValueOrDefault())
        {
            Console.WriteLine("Test");
        }
        if (<<Main>$>g__FooBar|0_0().GetValueOrDefault())
        {
            Console.WriteLine("Test");
        }
    }

    [CompilerGenerated]
    internal static Nullable<bool> <<Main>$>g__FooBar|0_0()
    {
        return null;
    }
}
```

Thus, it is down to preference. And I prefer the use of null coalescing operator `??` more. Wanna prove me wrong? 8-)