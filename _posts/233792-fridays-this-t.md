---
title: |-
  Friday's This<T>
date: 2019-07-25T06:29:00Z
tags:
  - C#
---
Last week on Friday I was working on some code, I don't even remember what it was, and there was excessive usage of `this`. And my personal pet peeve is writing most readable code in most succinct way possible. For sure `this` hurts this (no pun intended). The following class is a result of that Friday's frustration.

<!-- excerpt -->

I wrote it in few minutes, just for fun. I don't claim it's correct or useful.

Oh, and yes. The `Τhis` property is (ab)using Unicode because it is using `U+03A4` for _T_.

```csharp
public class This<T> where T : class
{
	public T Τhis { get; }

	public This(T value) => Τhis = value;

	public override int GetHashCode() => Τhis?.GetHashCode() ?? 0;

	public override string ToString() => Τhis?.ToString();

	public override bool Equals(object obj) => Τhis is null ? obj is null : Τhis.Equals(obj);

	public static implicit operator T(This<T> @this) => @this.Τhis;

	public static explicit operator This<T>(T value) => new This<T>(value);
}
```

One interesting thing from this exercise - I realized I can use _expression body_ for constructor.