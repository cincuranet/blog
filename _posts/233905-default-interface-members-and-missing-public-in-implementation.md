---
title: |-
  Default interface members and missing "public" in implementation
date: 2022-09-21T07:56:00Z
tags:
  - C#
---
Recently I spent surprising amount of time chasing behavior that didn't match my expectations. As you can guess the problem was between keyboard and chair. Hopefully my mistake can help you save minutes (or hours) of debugging.

<!-- excerpt -->

Let's have this simple interface.
```csharp
interface IGotcha
{
	void DoGotcha();
	void DoMoreGotcha() => DoGotcha();
}
```

And implementation.
```csharp
class Gotcha : IGotcha
{
	public void DoGotcha()
	{
		Console.WriteLine("Gotcha");
	}

	void DoMoreGotcha()
	{
		Console.WriteLine("MoreGotcha");
	}
}
```

With these pieces in place, what does this code print?
```csharp
static void Main()
{
	var g = new Gotcha();
	DoGotcha(g);
}

static void DoGotcha(IGotcha g)
{
	g.DoGotcha();
	g.DoMoreGotcha();
}
```

If you answered _2x Gotcha_, you're right. What you might expect to get is _Gotcha and MoreGotcha_. But why is that not the correct answer? Because the `Gotcha.DoMoreGotcha` is not public (I intentionally made it implicit private in my example, but i.e., (explicit) internal would do the same and would be probably harder to spot.), it's not implementation of `IGotcha.DoMoreGotcha`. Makes absolute sense, right?

Hope this realization saves you minutes (or hours) next time you have weird confusing behavior like this.
