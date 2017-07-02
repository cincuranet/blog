---
title: |-
  Nice succinct syntax for tuple deconstruction
date: 2017-06-25T15:04:00Z
tags:
  - C#
---
As I'm playing more and more with tuple in C# 7 to find out where this is useful and where it falls short and actually bites back later on. And during this I kind of by blind luck discovered more succinct syntax for deconstruction. I reminds me Python, which I like.

<!-- excerpt -->

The normal way to deconstruct a tuple looks like this.

```csharp
(var a, var b) = (10, 20);
```

But it can be written, with the same result, like this.

```csharp
var (a, b) = (10, 20);
```

I don't know about you, but that's more pleasant to my eyes.