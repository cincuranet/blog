---
title: |-
  Sum function using "generic math" and head and tail functions
date: 2023-01-17T12:35:00Z
tags:
  - C#
---
As promised in [previous blog post][1]. Let's implement that _sum_ function using [_generic math_ from C# 11][2]. 

<!-- excerpt -->

```csharp
static T Sum<T>(ListRangeWrapper<T> list) where T : INumber<T>
    => list switch
    {
        [] => T.Zero,
        [var head, .. var tail] => head + Sum(tail),
    };
```

Except for the `T.Zero`, it's the same code. But it's still nice to be able to do it. 

But now simply calling the function like in previous post doesn't work.

```csharp
var list = new List<int>() { 1, 2, 3 };
Sum(list);
```

`The type arguments for method 'Sum<T>(ListRangeWrapper<T>)' cannot be inferred from the usage. Try specifying the type arguments explicitly.`

Well, maybe in the end I will have to add the overload anyway (or stop (ab)using the implicit casting). 

```csharp
static T Sum<T>(List<T> list) where T : INumber<T> => Sum((ListRangeWrapper<T>)list);
```

Of course, specifying the type explicitly (`Sum<int>(list)`) would work too. It's just not slick, I think.

[1]: {{ include "post_link" 233914 }}
[2]: https://learn.microsoft.com/en-us/dotnet/standard/generics/math
