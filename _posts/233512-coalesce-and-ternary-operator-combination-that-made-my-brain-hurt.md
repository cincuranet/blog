---
title: |-
  Coalesce and ternary operator - combination that made my brain hurt
date: 2015-07-02T13:52:00Z
tags:
  - .NET
  - C#
  - Best practice or not?
---
Often I like exploring all the nuances in languages and what you can do chaining stuff together. Today was not the day. Statement that was "clearly" correct was returning wrong values. Splitting it to pieces and executing produced expected values. After maybe an hour I finally understood my mistake. Let's have a look.

<!-- excerpt -->

Pretty simple code. Here's the simplified version (I know it looks weird, but I wanted to remove all noise to make it easy to go through).

```csharp
static void Main(string[] args)
{
	var result = NullableTrue()
		?? False()
			? false
			: true;
	Console.WriteLine(result);
}

static bool? NullableTrue()
{
	return true;
}

static bool False()
{
	return false;
}
```

Basically I call first method `NullableTrue` and if the result is not null I expect the value to be returned. The [coalesce operator][1] should take care of that, right? Hence with the values I'm returning the value printed should be `True`. Or...

When you try to execute the code, the result will be `False` printed. Nothing magical, just plain old operator precedence. Stuff you learn basically as a first thing in math or programming. Still, as I nicely indented my code I confused myself with the different order. 8-) This code is actually evaluated like this.

```csharp
var result = (NullableTrue()
	?? False())
		? false
		: true;
```

You should have seen my confusion with return values and trying every trick I know to crack it. Of course once I realized my mistake and adding braces on appropriate places everything started working.

```csharp
var result = NullableTrue()
	?? (False()
		? false
		: true);
```

Maybe it's time to read some basics. :-)

[1]: https://msdn.microsoft.com/en-us/library/ms173224.aspx