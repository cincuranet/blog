---
title: "How to break your code easily a.k.a my params hell"
date: 2010-06-26T12:41:55Z
tags:
  - .NET
  - C#
redirect_from: /id/231701/
layout: post
---
Today I faced a behavior I have no idea exists. It's more or less ambiguity between method with some parameters and one using `params`. Why more or less? Well, because it surely described in C# specification ("best match" or something similar to it). But I hadn't know I should think about it until I was debugging weird behavior.

Let's start with simple class:

```csharp
class Test
{
	public Test(params int[] foos)
	{
		Console.WriteLine("foos");
	}
	public Test(int foo, int bar)
	{
		Console.WriteLine("foo bar");
	}
}
```

And now some (mind blowing ;)) code:

```csharp
new Test(1);
new Test(1, 2);
new Test(1, 2, 3);
```

If you see the code in the context you probably spot the problem easily. The second row will not call the `params` but the other constructor.

Which is "cool" until you're doing some refactoring and you (as I did) add new constructor with `params` and everything starts behaving unexpectedly. Maybe this text will help somebody to realize this faster than I did. :D