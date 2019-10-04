---
title: |-
  What's the maximum number of generic parameters for a class in .NET/C#?
date: 2019-10-04T10:16:00Z
tags:
  - .NET
  - .NET Core
  - C#
---
Pretty stupid question, right? Because if it's more than, say, 20 or 100, it's enough. But still. Where is the limit?

<!-- excerpt -->

We can look at this in, at least, two ways. First is obviously what the runtime is willing to load and the other is what Roslyn is able to compile. And there's a good chance, that these two limits are the same.

#### Roslyn

Let's first check the compiler, because that's how most people would create such type. Obviously, I'm not going to type that type manually, but I'm going to use T4. With the code below you can easily try that the limit is `65535` or `2^16 - 1` using the current .NET Core 3.0.

```text
<#@ assembly name="System.Core" #>
<#@ assembly name="System.Runtime" #>
<#@ import namespace="System.Linq" #>
<#@ import namespace="System.Collections.Generic" #>
<#
IEnumerable<long> Range(long start, long end)
{
	for (var i = start; i < end; i++)
		yield return i;
}
IEnumerable<T> Repeat<T>(T value, long count)
{
	for (var i = 0; i < count; i++)
		yield return value;
}

const int Max = 65535;
var ts = string.Join(", ", Range(0, Max).Select(x => $"T{x}"));
var referenceTypes = string.Join(", ", Repeat("string", Max));
var valueTypes = string.Join(", ", Repeat("int", Max));
#>
namespace ConsoleApp1
{
	class RealGenericClass<<#=ts#>>
	{
	}
	static class RealGenericClass
	{
		public static RealGenericClass<<#=referenceTypes#>> CreateWithReferenceTypes() => new RealGenericClass<<#=referenceTypes#>>();
		public static RealGenericClass<<#=valueTypes#>> CreateWithValueTypes() => new RealGenericClass<<#=valueTypes#>>();
	}
}
```

#### Reflection.Emit

Another way, way less common yet somewhat in the middle, is using `Reflection.Emit`. In my case there's not much to emit, just define type and try to load it. With the simple code below the process fails again at `65535`/`2^16 - 1`.


```csharp
static void ReflectionEmit()
{
	var assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(new AssemblyName("Dummy"), AssemblyBuilderAccess.Run);
	var moduleBuilder = assemblyBuilder.DefineDynamicModule("Dummy");
	var typeBuilder = moduleBuilder.DefineType("RealGenericClass", TypeAttributes.Class);
	typeBuilder.DefineGenericParameters(Ts().ToArray());
	var generic = typeBuilder.CreateType();
	var t = generic.MakeGenericType(Repeat(typeof(int), Max).ToArray());
	var instance = Activator.CreateInstance(t);
	Console.WriteLine(instance);

	static IEnumerable<string> Ts()
	{
		return Range(0, Max).Select(x => $"T{x}");
	}

	static IEnumerable<long> Range(long start, long end)
	{
		for (var i = start; i < end; i++)
			yield return i;
	}

	static IEnumerable<T> Repeat<T>(T value, long count)
	{
		for (var i = 0; i < count; i++)
			yield return value;
	}
}
```

Maybe if I create the assembly using some non-.NET-provided library (where the limitations are probably aligned), I might get lucky...

#### Manual assembly creation using _Mono.Cecil_

I took the trusty [_Mono.Cecil_][1] library and started generating. Here's the important part.

```csharp
var typeDefinition = new Mono.Cecil.TypeDefinition("ConsoleApp1", "RealGenericClass", Mono.Cecil.TypeAttributes.Class, baseType);
foreach (var item in Ts())
{
	typeDefinition.GenericParameters.Add(new Mono.Cecil.GenericParameter(item, typeDefinition));
}
assemblyDefinition.MainModule.Types.Add(typeDefinition);

static IEnumerable<string> Ts()
{
	return Range(0, Max).Select(x => $"T{x}");
}

static IEnumerable<long> Range(long start, long end)
{
	for (var i = start; i < end; i++)
		yield return i;
}
```

Sadly, although I was able to create type with more than `65535` generic parameters, runtime refuses to load it with known `Internal limitation: Too many generic arguments.`. Fair enough, I think.

Surprisingly _ildasm_ shows the type. And _ILSpy_ wraps over the `2^16` and shows just two generic arguments for my type with 65538 of these.

![Type with 65538 generic arguments in ildasm]({% include post_ilink, post: page, name: "65538_generics.png" %})

#### Closing

I think `65535` of generic parameters is fair. It's way beyond what would person type or use manually. And for generated code, well, I think it's still plenty and if you need more, I'm sure, given it's generated code, you can find way around it.

What's the biggest generic type you've ever created?

[1]: https://www.mono-project.com/docs/tools+libraries/libraries/Mono.Cecil/