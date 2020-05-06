---
title: |-
  Lesser known feature of digit separators in C# 7
date: 2018-03-01T11:06:00Z
tags:
  - C#
---
As [I was on the .NET.CZ podcast][1] I realized there's maybe a one specific behavior of digit separators in C# 7 people might not be aware of.

<!-- excerpt -->

#### Digit separators in C# 7

_Digit separators_ were [introduced in C# 7][2] and allows you to separate digits with `_` (underscore) character. Together with _binary literals_ (not only) this allows you to logically space some groups (4 bits, 8 bits, ...). Here's a small example with hexadecimal constant: `var foo = 0xFF_00_DD;`.

This feature was [improved in C # 7.2][3] allowing you to have leading underscores. Building on previous example, this is allowed in C# 7.2: `var foo = 0x_FF_00_DD;`.

#### Specific behavior

Not only you can have a single separator between groups/digits, but _you can have as much as you want_. This allows you to format the literal even more.

Compare this example.

```csharp
var a = 0b__10_11__11_01;
var b = 0b_10_11_11_01;
```

For me, the `a` is more readable. And if this is some kind of protocol, it might even nicely complement high/low bytes/words/...

```csharp
var foo = 0b_01_11;
var bar = 0b_00_11;
var baz = 0b____11;
```

For me, the `baz` clearly tells only the `11` part is important. Rest is just "padding".

#### Closing

We all lived without a digit separators feature, but I see it as a welcoming formatting/readability option especially for hexadecimal and binary literals. And ability to use multiple separators in sequence makes it even more useful.

Did you know about this?

[1]: {{ include "post_link" 233705 }}
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-7#numeric-literal-syntax-improvements
[3]: https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-7-2#leading-underscores-in-numeric-literals