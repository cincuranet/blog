---
title: |-
  Fun with C#'s local functions - part 2
date: 2018-04-19T13:06:00Z
tags:
  - C#
---
I was speaking about new features in C# 7.x and 8 some days ago and as the questions came in, some were really good small brainstorming, basically trying where C# compiler limits are. And that's always interesting to me.

From this brainstorming I have two interesting pieces. This is the other one and the first one is [here][1].

<!-- excerpt -->

[Local function][2] can be called before it's declared. Same as in the rest of C#. Very simple example.

```csharp
public static void FooBar()
{
	Test();
	int Test() => 10;
}
```

Can I (ab)use this function to access variable before it's declared (from the point where I'm calling the local function)? Let's find out.

```csharp
public static void FooBar()
{
	var i = 10;
	int Test() => i;
}
```

So far so good. It compiles and from the previous example I know I can call a local function before it's declared. Here we go.

```csharp
public static void FooBar()
{
	Test();
	var i = 10;
	int Test() => i;
}
```

And it fails to compile. The error message is `Use of unassigned local variable 'i'`, which thinking about it makes sense. Of course, moving the `Test` call after `i` declaration and assignment makes the error disappear. Interesting to see the compiler has "reachability" (that's my term, I don't know how it's really called) graph that's not just local.

But let's not give up too soon. Maybe I can access it via another local function defined before the `i`.

```csharp
public static void FooBar()
{
	int Test2() => Test();
	Test2();
	var i = 10;
	int Test() => i;
}
```

Does this work? No. Same error. The "reachability" graph clearly works.

Although this was a one-minute fun during my talk, I have a feeling it's not over and I'll spend trying to access that variable in the future. :)

[1]: {{ include "post_link" 233714 }}
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/local-functions