---
title: |-
  C# static constructor called multiple times
date: 2021-09-07T17:26:00Z
tags:
  - .NET
  - .NET Core
---
Few days ago, I had a behavior I couldn't believe. Static constructor of my C# class was clearly called two times. For no reason! Even the static variable it was initializing was `null` during second call. How is that even possible?

<!-- excerpt -->

When I first saw this behavior, I couldn't believe it. Taking a deep breath, I ruled out that Microsoft, in last two decades, missed such issue. Because I was debugging multi-process application I validated, multiple times, that I'm really in the same process. I was. After evaluating half a dozen options in my head, I was starting to think I'm crazy. It was clearly happening, but it didn't make any sense.

As usual, the explanation is pretty straightforward. The class was accessed from assemblies in two different [`AssemblyLoadContext`][1]s. Glad I realized that before I started ripping everything apart. Phew.

If you'd like to experience this yourself, following simple code shows that behavior.

```csharp
namespace StaticCtorALC
{
	class Program
	{
		static void Main()
		{
			var executingAssembly = Assembly.GetExecutingAssembly();

			FooBar.Test();
			//var alc = AssemblyLoadContext.Default;
			var alc = new AssemblyLoadContext("Test");
			var assembly = alc.LoadFromAssemblyPath(executingAssembly.Location);
			var type = assembly.GetType("StaticCtorALC.FooBar");
			var method = type.GetMethod("Test");
			method.Invoke(null, null);
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

With the code as is, you're going to see `Hello! ;)` twice. Switching to the line with ` AssemblyLoadContext.Default` it will behave "normally".

I'm happy to understand this behavior now and one day I'll use it again, like a boss.

> [Follow-up post.][2]

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.runtime.loader.assemblyloadcontext?view=net-5.0
[2]: {{ include "post_link" 233871 }}