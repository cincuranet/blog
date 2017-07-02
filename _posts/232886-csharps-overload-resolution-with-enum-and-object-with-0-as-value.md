---
title: |-
  C#'s overload resolution with enum and object with 0 as value
date: 2012-05-31T14:07:44Z
tags:
  - .NET
  - C#
---
Today I faced surprising behavior once again. Completely off guard.

Let's have a code:

```csharp
static void Test(string s, object o)
{
	Console.WriteLine("object");
}
static void Test(string s, TestEnum e)
{
	Console.WriteLine("enum");
}
```

```csharp
enum TestEnum
{
	Zero = 0,
	One = 1,
	Two = 2,
}
```

and call it:

```csharp
Test("rrr", 0);
Test("rrr", 1);
Test("rrr", 2);
Test("rrr", -1);
Test("rrr", 100);
```

What do you think you'll see? Surprisingly, at least for me, it's:

```text
enum
object
object
object
object
```

After searching for a while I found [Eric Lippert's post about it][1]. Basically there's something we can call _magic zero_ and this can be implicitly converted to any enum (even empty one or one without `0` value). That's the root cause of this behavior. Of course, when C# compiler sees this value in method call, it selects the more specific overload (the one with `TestEnum`) over the one with `object`.

Learning new stuff every day...

[1]: http://blogs.msdn.com/b/ericlippert/archive/2006/03/29/the-root-of-all-evil-part-two.aspx