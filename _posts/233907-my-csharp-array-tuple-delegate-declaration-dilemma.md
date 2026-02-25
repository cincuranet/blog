---
title: |-
  My C# array, tuple, delegate declaration dilemma
date: 2022-11-14T08:00:00Z
tags:
  - C#
---
I usually create arrays like this. Nothing fancy. And most people around me use the same. I would even say it's kind of a standard way in C#.

```csharp
var data = new[] { 1, 2, 3 };
```

But today I realized, you can also use this (target-typed new expressions) when using arrays.

<!-- excerpt -->

```csharp
int[] data2 = { 1, 2, 3 };
```

Which looks dumb if you prefer `var`, like I do. And if you don't, what's wrong with you? 😎

Also, this doesn't work if you want to pass that array into a method, for example.

```csharp
void Foo(int[] data) { }
Foo({ 1, 2, 3 });
```

So, you might be wondering why I'm writing about it.

Well, there's at least one case where this, approach works better than my usual one. Let's say you have a `static readonly` array (kind of a constant) with tuples with delegates. Something like this.

```csharp
float Bar(float x) => x;

static readonly (string, Func<float, float>)[] Data = new[]
{
	("test", Bar),
};
```

Then this declaration doesn't work, and you have to explicitly state the type of array.

```csharp
static readonly (string, Func<float, float>)[] Data2 = new (string, Func<float, float>)[]
{
	("test", Bar),
};
```

I'm not fan of this.

But what you actually can do, and works fine, is this.

```csharp
static readonly (string, Func<float, float>)[] Data3 =
{
	("test", Bar),
};
```

Isn't that cool (or weird)? I like that I don't have to repeat the type. I like that a lot. On the other hand, I don't like the missing `new` (I don't like target-typed new expressions in general). But, but it's so nice, succinct. I like succinct code. But I also like consistency in my code. In any code. Could I use it everywhere, i.e., for above mentioned arguments for methods, I would be probably sold (for arrays only).

I'm so torn right now. I might have to revisit my very own C#-code-writing rules 🤯.
