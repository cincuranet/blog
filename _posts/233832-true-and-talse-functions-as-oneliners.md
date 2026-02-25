---
title: |-
  True and False functions as "oneliners"
date: 2020-06-29T06:38:00Z
tags:
  - C#
---
I was reading Stephen Cleary's [A New Pattern for Exception Logging][1] blogpost and the `True` and `False` methods caught my eye and I wanted to write them as "oneliners".

<!-- excerpt -->

By "oneliner" I mean method that's using _expression body_. If you're looking for answer to "Why?", I don't have it. So, let's consider it a quick exercise in C#.

The _expression body_ as the name implies, has to be expression and not bunch of statements in a block. I need to call an `Action` and return `bool`. Which is actually `Func<bool>`. Having that it's easy to do so.

```csharp
public static bool False(Action action) => new Func<bool>(() => { action(); return false; })();
```

You might not like the `new` being there, luckily casting works just fine.

```csharp
public static bool False(Action action) => ((Func<bool>)(() => { action(); return false; }))();
```

Both versions result in same IL, so at the end of the day, it's only about your personal preference.

And finally, as a little bit of fiddling it can be made bit more obfuscated. Or succinct?

```csharp
using a = System.Action;
using b = System.Func<bool>;
class C
{
	const bool f = false;
	public static bool False(a a) => ((b)(() => { a(); return f; }))();
}
```

I'll leave this exercise here, because I feel it could end up with very ugly code.

[1]: https://blog.stephencleary.com/2020/06/a-new-pattern-for-exception-logging.html