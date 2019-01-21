---
title: |-
  Switch to errors instead of warnings for nullable reference types in C# 8
date: 2019-01-21T12:57:00Z
tags:
  - C#
  - Roslyn
  - MSBuild
---
[Nullable reference types][1] coming in C# 8 are a great addition to anyone's toolbox. But if you tried it you probably know "just" warnings are produced. And sometimes you'd like to have errors instead of warnings, so the build fails hard or something like that. It's surprisingly easy to do so.

<!-- excerpt -->

You might have heard about the _TreatWarningsAsErrors_ option, which basically promotes all warnings to errors (which is sometimes useful). But there's also _WarningsAsErrors_ option which is a list of warnings to be treated as errors (and that is subsequently passed to `csc`). With that we're half way there.

Sadly, there isn't only one warning for nullable references types, but because Roslyn is open source, we don't have to guess. In [`ErrorCode.cs`][2] we can see all and also guess from the name what's the issue covered.

When you're done selecting the ones you're interested in, just add `WarningsAsErrors` tag into your `csproj` (or you can do it via UI in Properties of the project). Following is how a very simple project file with some warnings added might look like.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.2</TargetFramework>
    <LangVersion>8.0</LangVersion>
    <WarningsAsErrors>CS8600;CS8602;CS8603</WarningsAsErrors>
  </PropertyGroup>
</Project>
```

Why I selected these three, you ask? Just a few - common in my opinion - to try and show here.

Probably the most famous will be `CS8602` which is `Possible dereference of a null reference.`.

```csharp
static void Foo(string? s)
{
    var x = s.Length;
}
```

Another could be `CS8603` which is `Possible null reference return.`.

```csharp
static string Bar(DateTime? d)
{
    return d?.ToString();
}
```

The last one is `CS8600` ` Converting null literal or possible null value to non-nullable type.` (I like how it also takes into account the `null` literal).

```csharp
static void Baz()
{
    string? F() => null;
    string f = F();
}
```

The list of error codes on the link above contains all and one can surely include all. But it's also about understading and resolving the warnings/errors properly, not just making them dissappear with `!`s or `?`s.

[1]: https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references
[2]: https://github.com/dotnet/roslyn/blob/f74016a74c964faa446c9514d94af59af5fe24db/src/Compilers/CSharp/Portable/Errors/ErrorCode.cs#L1629