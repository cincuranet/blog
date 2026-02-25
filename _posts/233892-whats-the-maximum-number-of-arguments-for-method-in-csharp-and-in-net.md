---
title: |-
  What's the maximum number of arguments for method in C# and in .NET?
date: 2022-03-07T12:46:00Z
tags:
  - C#
  - .NET
---
Silly question, right? Whatever the limit is, it is surely beyond what one should practically ever write. Right? But as with mine other explorations of limits, I'll try it anyway.

<!-- excerpt -->

Let's start with C# or IL respectively. For C# compiler to call method and pass an argument it needs to generate `ldarg` (or `ldarg.0`, `ldarg.1`, etc.). The [documentation][1] states, that the argument is _unsigned int16_. Thus, it should be impossible to go over this limit. Let's try it.

```text
<#
const int Max = 65537;
#>

class Test
{
	public static void Huge(<#= string.Join(", ", Enumerable.Range(0, Max).Select(x => $"byte arg{x}")) #>)
	{ }

	public static void CallHuge()
	{
		Huge(<#= string.Join(", ", Enumerable.Range(0, Max).Select(_ => "0")) #>);
		Console.WriteLine("It works!");
	}
}
```

This simple T4 template generates method with 65537 arguments. The compilation fails with `System.ArgumentOutOfRangeException: Specified argument was out of the range of valid values. (Parameter 'sequenceNumber')`, as expected. Using 65536 works.

OK, all the pieces fit together. But can I actually call such method? That's where the `CallHuge` from the template comes into picture. Trying to run such program results in `System.InvalidProgramException: Common Language Runtime detected an invalid program.`. Fair enough. But where's the limit then? With a bit of bisection I ended up on 8192. That might look like a weird number, but it's actually `2^13`  or also `65536/8`.

And there you have it. Roslyn compiler will compile method with 65536 arguments. Runtime version 6.0.2 executes only with 8192.

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.ldarg?view=net-6.0
