---
title: |-
  Throwing null literal
date: 2019-09-19T06:09:00Z
tags:
  - C#
---
"Every" week I discover something new (and I'm not afraid to share it). Today isn't any different. Apparently, C# compiler is fine with code throwing `null` literal. Yes, it looks weird, but if you think about it, it makes sense. Let me show you.

The code below compiles fine and results in `NullReferenceException` being thrown.

```csharp
static void Test1()
{
	throw null;
}
```

I don't know about you, but this, if not weird, looks funny. The `NullReferenceException` thrown isn't anything special and you can catch it is as usual.

```csharp
static void Test2()
{
	try
	{
		throw null;
	}
	catch (NullReferenceException ex)
	{
		Console.WriteLine(ex.ToString());
	}
}
```

So why is `throw null` even allowed? It looks like a special case, to be disallowed, but it's not. Following simple code is absolutely acceptable.

```csharp
static void Test3()
{
	Exception GetMeException() => DateTime.Now.DayOfWeek == DayOfWeek.Thursday ? null : new InvalidOperationException();

	throw GetMeException();
}
```

Basically "sometimes" my code returns `null` and that is then thrown. Discussion whether that is a bug or not is another discussion.

When I first saw (and it was in reference assemblies) the `throw null` I was perplexed. But trying it and then thinking about it in broader context, I realized it's just a valid (but pretty stupid, don't do it) code stripped to absolute minimum.
