---
title: "Enum.HasFlag is in .NET 4"
date: 2009-10-22T14:30:47Z
tags:
  - .NET
redirect_from: /id/230951/
layout: post
---
Today I noticed, that in beta 2 of .NET Framework 4 (and Visual Studio 2010) there's a new method for enums - [HasFlag][1]. Using bitwise operators was sometimes ugly and decreased the readability of code, hence (I think) almost everybody wrote similar method i.e.:

```csharp
static bool HasFlag(this Enum e, Enum flag)
{
	return ((Convert.ToInt32(e) & Convert.ToInt32(flag)) != 0);
}
```

But now it's directly in framework. Great! I like these small additions that make life easier.

[1]: http://msdn.microsoft.com/en-us/library/system.enum.hasflag(VS.100).aspx