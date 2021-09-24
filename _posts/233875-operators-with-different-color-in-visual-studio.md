---
title: |-
  Operators with different color in Visual Studio
date: 2021-09-24T08:59:00Z
tags:
  - Visual Studio
  - C#
---
When writing some code day or two ago I noticed one operator color in Visual Studio being different color than it usually is. I initially thought it's a fluke in syntax highlighting that will eventually go away. When it didn't, I decided to investigate.

<!-- excerpt -->

Look at this image, with double font size to make it more visible.

![Different operator color]({{ include "post_ilink" page "operator.png" }})

The first `+` sign is clearly different color than the other. What's going on? It's actually pretty easy to explain. If you have a custom type with overloaded operator, using it results in this highlighting.

```csharp
class Program
{
	static void Main(string[] args)
	{
		var x = new Test();
		_ = x + x;
		_ = 1 + 1;
	}
}

class Test
{
	public static Test operator +(Test lhs, Test rhs) => default;
}
```

Plus operator is probably not overloaded that often, but for i.e. (in)equality, this might become handy. You're clearly going to see the type has some handling of the (in)equality and whether that's expected.