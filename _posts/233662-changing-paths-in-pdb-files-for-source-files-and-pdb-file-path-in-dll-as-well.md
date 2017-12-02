---
title: |-
  Changing paths in PDB files for source files (and PDB file path in DLL as well)
date: 2017-12-02T19:26:01Z
tags:
  - .NET Core
  - Roslyn
---
Although you can disable PDB files generation altogether, it's good idea to have these. Debugging without PDB files later is so much harder, like if debugging isn't hard enough already. One thing that might be bothering you, is the source files location that is stored in PDB files. You might want to change these paths - build servers often use random directory names or you might want to simply hide that the project directory on your hard drive has some weird name. :)

<!-- excerpt -->

For such scenario `PathMap` variable is available in `csproj`, where you can specify mapping from original path to new path.

Building some application and opening the PDB file in i.e. _Notepad_, easily shows the paths are there. And these paths will be in exception's stack trace for example. As expected.

Let's modify the `csproj` file by adding these lines (I created the `AppOutputBase` variable for better readability).

```xml
<AppOutputBase>$(MSBuildProjectDirectory)\</AppOutputBase>
<PathMap>$(AppOutputBase)=X:\test\</PathMap>
```

Building the application again, now the paths are changed to `X:\test`. That also means, when the exception is thrown and i.e. logged, the exception will have new paths in stack trace.

```text
Unhandled Exception: System.InvalidOperationException: Operation is not valid due to the current state of the object.
   at ConsoleApp1.Program.Main(String[] args) in X:\test\Program.cs:line 9
```

As a bonus the path to the PDB file in the DLL has a new path as well. In my test `X:\test\obj\Debug\netcoreapp2.0\ConsoleApp1.pdb`.

The parameter from `csproj` is internally passed to [Roslyn][2] via [command line parameter `/pathmap:k1=v1,k2=v2`][1], so it's not some kind of dark magic. Also, as you can see multiple values can be passed, if you need to.

The scenarios, and certainly others have more, I sketched at the beginning are not unsolvable, although with `PathMap` it's so much easier.

[1]: https://github.com/dotnet/roslyn/blob/master/docs/compilers/CSharp/CommandLine.md
[2]: https://github.com/dotnet/roslyn