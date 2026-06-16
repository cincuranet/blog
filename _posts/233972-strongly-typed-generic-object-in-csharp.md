---
title: |-
  Strongly typed generic object in C#
date: 2026-06-16T08:21:00Z
tags:
  - C#
  - .NET
---
Because sometimes you just need bit more type safety.

<!-- excerpt -->

```csharp
public class Object<T> : Object
{ }
```

Isn't it beautiful? And useless... But I think I can do better, it feels like I'm missing something.

```csharp
public class Object<T> : Object
    where T : Object<T>
{ }
```

That's better. But... What about `null`s? We know `null`s are source of so many problems.

```csharp
public class Object<T> : Object
    where T : notnull, Object<T>
{ }
```

Ahhh. Now it's how I like it. Completely utterly useless. 8-)