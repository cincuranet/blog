---
title: "Two interesting edge cases for when clause"
date: 2015-12-03T04:24:00Z
tags:
  - .NET
  - C#
redirect_from: /id/233537/
category: none
layout: post
---
Last weekend [I was speaking on a conference][1] and one of my two sessions was about new features in C# 6. I like when people ask questions about topic I'm explaining and in this session there were two questions I'd like to share with you, because I think these are very interesting (and also I'm pretty sure it's described to a detail in the specification, but that's boring 8-)) and hence worth sharing.

<!-- excerpt -->

#### The feature

C# 6 brings a new feature for optional filter for `catch` clause. Instead of just having a type the `catch` block handles you can also add a `when` clause and some condition. Here's a little example.

```csharp
try
{
	// something...
}
catch (SomeException ex) when (ex.Something == something)
{
	// handle it...
}
```

Pretty straightforward, right?

#### Can you use `await` in `when` clause?

Just pause here for a minute and think about it. Isn't that an awesome idea? Maybe bit crazy. Anyway, let's try it out.

```csharp
try
{
	// something...
}
catch (SomeException ex) when (await Whoa(ex))
{
	// handle it...
}
```

Where the `Whoa` might look like this.

```csharp
static Task<bool> Whoa(Exception ex)
{
	return Task.FromResult(true);
}
```

Well this results in nice `CS7094` with pretty clear message `Cannot await in the filter expression of a catch clause`.

Alright, so you cannot use `await` in `when` clause.

#### What if the code in `when` clause throws an exception?

That seems to be valid question. And thinking about it there might be two cases. First case when the code throws exception that's of type the `catch` clause could handle and the other when the exception is of "incompatible" type. Let's try the first one as that might provide more fun.

```csharp
try
{
	throw new ArgumentException();
}
catch (ArgumentException ex) when (Throw<ArgumentNullException>(ex))
{
	Console.WriteLine($"Handling {ex.GetType().Name}");
}
```

And the helper `Throw` method.

```csharp
static bool Throw<TException>(Exception ex) where TException : Exception, new()
{
	throw new TException();
}
```

Running this code will clearly show the exception is not handled. Whether the type is "compatible" with the `catch` clause or not doesn't matter (one might quickly try it changing the `when` clause to i.e. `when (Throw<InvalidCastException>(ex))`).

Alright, so throwing exception is basically the same as returning `false`.

#### Closing

I was kind of expecting it to behave like this and it seems to be reasonable behavior to expect as well.

I like poking into (any) language or system from different angles and discover how it behaves and what was the reasoning behind that behavior.

[1]: {{ site.address }}{% post_url 2015-11-24-233536-ms-fest-2015-praha %}
