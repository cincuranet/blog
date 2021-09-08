---
title: |-
  Going deeper into static constructors hole
date: 2021-09-08T17:43:00Z
tags:
  - .NET
  - .NET Core
---
[Yesterday's][3] exploration led to another eye-opening moment. This goes even deeper. As you maybe know, [dependencies are shared][2] between [`AssemblyLoadContext`][1]s. This can lead to subtle changes of behavior depending on what's loaded where.

<!-- excerpt -->

Let's create a separate assembly `ClassLibrary` with a simple code.

```csharp
namespace ClassLibrary1
{
	public static class FooBarBaz
	{
		public static void Test()
		{
			FooBar.Test();
		}
	}
}
```

And expand a little bit code from yesterday.

```csharp
namespace StaticCtorALC
{
	class Program
	{
		static void Main()
		{
			FooBar.Test();
			var alc = new AssemblyLoadContext("Test");
			//alc.LoadFromAssemblyPath("StaticCtorALC.dll");
			var assembly = alc.LoadFromAssemblyPath("ClassLibrary1.dll");
			var type = assembly.GetType("ClassLibrary1.FooBarBaz");
			var method = type.GetMethod("Test");
			method.Invoke(null, null);

			Console.WriteLine();
			foreach (var c in AssemblyLoadContext.All)
			{
				Console.WriteLine(c.Name);
				foreach (var a in c.Assemblies)
				{
					Console.WriteLine($"  {a.FullName}");
				}
			}
		}
	}

	public static class FooBar
	{
		static FooBar()
		{
			Console.WriteLine("Hello! ;)");
		}

		public static void Test()
		{
			Console.WriteLine("Test");
		}
	}
}
```

Because the dependencies are shared, the `Hello! ;)` is printed only once. But if I load the _StaticCtorALC.dll_ manually explicitly into my _Test_ `AssemblyLoadContext` (the commented-out line) I get `Hello! ;)` again twice. 

In above case I controlled all the loading. In real world you might not have complete control and complete picture. You can go further and start thinking about what happens when you load the _StaticCtorALC.dll_ later and even putting next `AssemblyLoadContext` into the mix - suddenly the `cctors` calls depend on order of loads into other `AssemblyLoadContext`s. Still deterministic, but one extra call can change the order (and behavior) dramatically. Queue head explosion.

All this reminds me precautions when dealing with multi-threaded behavior or locking. Extremely easy to crumple everything down with almost invisible change too. Let's hope I'll make it through all the ins and outs of `AssemblyLoadContext` in the future.

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.runtime.loader.assemblyloadcontext?view=net-5.0
[2]: https://docs.microsoft.com/en-us/dotnet/core/dependency-loading/understanding-assemblyloadcontext#how-are-dependencies-shared
[3]: {{ include "post_link" 233870 }}