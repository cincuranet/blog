---
title: "New IStructuralEquatable, IStructuralComparable and StructuralComparisons"
date: 2009-07-04T12:08:16Z
tags:
  - .NET
  - C#
  - F#
redirect_from: /id/230692/
category: none
layout: post
---
.NET Framework 4 comes with (among others) with two new interfaces. [IStructuralEquatable][1] and [IStructuralComparable][2]. These are implemented (right now in Beta 1) by [Array][3] and [Tuple(s)][4].

With this new implementations and [StructuralComparisons][5] you can check arrays and tuples for structural equality (or compare these).

```csharp
object[] o1 = new object[] { 1, "2" };
object[] o2 = new object[] { 1, "2" };
Console.WriteLine(o1.Equals(o2));
Console.WriteLine(o1.Equals(o2, StructuralComparisons.StructuralEqualityComparer));
```

The code above writes first false and then true. The first one is classic "old-school" Equals. Following line is using new structural comparison, thus the true as result. Neat, isn't it?

By the way, F# is now using these interfaces too.

[1]: http://msdn.microsoft.com/en-us/library/system.collections.istructuralequatable(VS.100).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.collections.istructuralcomparable(VS.100).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.array(VS.100).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.tuple(VS.100).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.collections.structuralcomparisons(VS.100).aspx