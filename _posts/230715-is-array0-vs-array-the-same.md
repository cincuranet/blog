---
title: |-
  Is array[0] vs. array[] { } the same?
date: 2009-07-08T16:06:28Z
tags:
  - .NET
  - C#
---
Today I was writing some code, where I needed create initially empty array. I wondered if the `array[0]` vs. `array[] { }` is the same. Alike with the [string concatenation][1].

Without writing further text. Lines:

```csharp
private static void Test1()
{
	string[] s1 = new string[0];
	Console.WriteLine(s1);
}
private static void Test2()
{
	string[] s2 = new string[] { };
	Console.WriteLine(s2);
}
```

resulted in this IL:

```text
.method private hidebysig static void  Test1() cil managed
{
  // Code size       14 (0xe)
  .maxstack  1
  .locals init ([0] string[] s1)
  IL_0000:  ldc.i4.0
  IL_0001:  newarr     [mscorlib]System.String
  IL_0006:  stloc.0
  IL_0007:  ldloc.0
  IL_0008:  call       void [mscorlib]System.Console::WriteLine(object)
  IL_000d:  ret
} // end of method Program::Test1
.method private hidebysig static void  Test2() cil managed
{
  // Code size       14 (0xe)
  .maxstack  1
  .locals init ([0] string[] s2)
  IL_0000:  ldc.i4.0
  IL_0001:  newarr     [mscorlib]System.String
  IL_0006:  stloc.0
  IL_0007:  ldloc.0
  IL_0008:  call       void [mscorlib]System.Console::WriteLine(object)
  IL_000d:  ret
} // end of method Program::Test2
```

As you (and I) can see, the code is the same (I was kind of expecting that - but what's better proof than IL?). So you don't need to worry using the first or the other syntax.

[1]: {{ include "post_link" 224879 }}