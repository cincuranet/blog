---
title: |-
  C#'s discards don't need var
date: 2019-01-23T18:14:00Z
tags:
  - C#
---
From the "Today I found out and it's even in the documentation" series. Did you know that when you're using [discards in C# (the `_`)][1] you don't have to use `var`? Let's see it in action.

<!-- excerpt -->

A simple example would be.

```csharp
_ = SomeFunction();
```

Which of course is retarded. Most of the time. Because if you don't care about the result, you can just call the function and not do any assignments. But there's (at least) one reasonable example. Let's assume you have something like this.

```csharp
static async Task Main(string[] args)
{
	SomeFunctionAsync();
}
```

On the `SomeFunctionAsync` call you'll get a `CS4014` warning saying `Because this call is not awaited, execution of the current method continues before the call is completed. Consider applying the 'await' operator to the result of the call.`. That's mostly helpful warning, but sometimes you _really_ want to do fire-and-forget (and you know what you're doing). Although there's multiple way to get that warning solved, one simple is assigning to a discard (Another approach can be found [here][2] with the `NoWarning` method.).

```csharp
static async Task Main(string[] args)
{
	_ = SomeFunctionAsync();
}
```

And I find this very clean and expressive, because in my mind it can't be considered an overlook.

But back to the topic. More reasonable usage is with `out` variables, where you sometimes don't care about one or few. So instead of writing.

```csharp
bool IsInt(string s) => int.TryParse(s, out var _);
```

You can write.

```csharp
bool IsInt(string s) => int.TryParse(s, out _);
```
Which obviously is shorter and more succinct. And I like succinct code.

Now I have to go through all of my code, change it and pretend I knew from beginning. ;)

[1]: https://docs.microsoft.com/en-us/dotnet/csharp/discards
[2]: {{ include "post_link" 233470 }}