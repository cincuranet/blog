---
title: |-
  Pure magic in C# using tuples and relational patterns
date: 2022-02-02T12:40:00Z
tags:
  - C#
---
As I was writing bunch of `if`s today, I was thinking whether it would be possible to use pattern matching from recent versions of C#. To make things more interesting, I was comparing multiple values and it was not a simple equality. Blindly typing the code, I was very surprised Roslyn didn't complain.

<!-- excerpt -->

Let's jump into the code and be amazed.

```csharp
string Foo(int x, int y)
{
    return (x, y) switch
    {
        (> 32, not 3) => "foo",
        (> 40, not > 4) => "bar",
    };
}
```

The `(x, y)` tuple is matched, nothing special. But then. Not a simple match on exact values. It's using relational patterns. Wow, I was not expecting that to work. Nice!

This is going to be another special tool in my toolbox.
