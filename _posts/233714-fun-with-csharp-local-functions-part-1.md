---
title: |-
  Fun with C#'s local functions - part 1
date: 2018-04-19T13:05:00Z
tags:
  - C#
---
I was speaking about new features in C# 7.x and 8 some days ago and as the questions came in, some were really good small brainstorming, basically trying where C# compiler limits are. And that's always interesting to me.

From this brainstorming I have two interesting pieces. This is the first one and the other one is [here][1].

<!-- excerpt -->

[Local functions][2] can be defined anywhere inside the method. Even inside the `if` block. Can these have same name (or simply what's the scope)? And if so what will calling the function do?

Let's start with simple test, defining same name functions in `if` and `else`.

```csharp
public static void FooBar(int x)
{
	if (x != 0)
	{
		int Test() => 10;
	}
	else
	{
		int Test() => 20;
	}
}
```

No complains from compiler, so that clearly works. But the next step is calling the `Test` function. Outside the `if`-`else` statement.

```csharp
public static void FooBar(int x)
{
	if (x != 0)
	{
		int Test() => 10;
	}
	else
	{
		int Test() => 20;
	}
	Test();
}
```

That does not work. And I would be very surprised if it would. It's outside the scope (similarly to how i.e. variables behave) and it's ambiguous which one should be called.

But, ..., can I somehow extend the scope? And make it look like a regular method call? Maybe to play a little trick on your colleagues. :)

```csharp
public static void FooBar(int x)
{
	Func<int> Snafu;
	if (x != 0)
	{
		int Test() => 10;
		Snafu = Test;
	}
	else
	{
		int Test() => 20;
		Snafu = Test;
	}
	Snafu();
}
```

Well, that works. In this particular piece of code, it's not that difficult to see where the trick is, but I'm sure one can come up with elaborate way(s) to hide it into regular code. ;)

[1]: {{ include "post_link" 233715 }}
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/local-functions