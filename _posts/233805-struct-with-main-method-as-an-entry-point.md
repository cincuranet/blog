---
title: |-
  Struct with "main method" as an entry point
date: 2019-11-07T07:58:00Z
tags:
  - .NET
  - .NET Core
  - C#
---
Have you ever thought about the most basic structure of an application? The _main method_ and its placement in `Program` _class_...

<!-- excerpt -->

Today as I was creating yet another console app to test something (boxing of structs, in case you'd like to ask) I looked at the `class Program` piece and tried to rewrite it to `struct`. Just to try it. Would it work? Given the _main_ does not even have to be `public` and it's `static`, which works for `struct`, it probably should, right?

```csharp
struct Program
{
	static void Main(string[] args)
	{
		Console.WriteLine("Hello struct!");
	}
}
```

Trying to compile this simple piece of code works like a charm. Are you asking what this might be useful for? I don't have an answer. I think it does not have any real useful application. But this made me look up ["specification" of what _main method_ should look like][1], at least.

[1]: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/main-and-command-args/index#overview 