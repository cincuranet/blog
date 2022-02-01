---
title: |-
  World's smallest C# program (featuring cheating)
date: 2022-02-01T14:20:00Z
tags:
  - Presentations & Speaking
---
When I read [_World's Smallest C# Program (featuring \`N\`)_][1] I was so intrigued. I had to give it a shot myself.

<!-- excerpt -->

Sadly, as I was reading the article, the rules killed all my ideas. But I went ahead anyway. My smallest C# program, that even(!) does something, is this.

```csharp
```

Yep, it's an empty file. In fact, it can be no file whatsoever. From the title of this post, you probably already know I'm cheating. What I did, is (ab)use _MSBuild_ to generate a file and add it into compilation.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
  <PropertyGroup>
    <ProgramText>
      <![CDATA[
namespace Mini%3B

public class Program
{
  public static void Main()
  {
    System.Console.WriteLine("Mini!")%3B
  }
}
      ]]>
    </ProgramText>
  </PropertyGroup>
  <Target Name="AddGeneratedProgram" BeforeTargets="BeforeCompile;CoreCompile" Inputs="$(MSBuildAllProjects)" Outputs="$(IntermediateOutputPath)GeneratedProgram.cs">
    <PropertyGroup>
      <GeneratedProgramPath>$(IntermediateOutputPath)GeneratedProgram.cs</GeneratedProgramPath>
    </PropertyGroup>
    <ItemGroup>
      <Compile Include="$(GeneratedProgramPath)" />
      <FileWrites Include="$(GeneratedProgramPath)" />
    </ItemGroup>
    <WriteLinesToFile Lines="$(ProgramText)" File="$(GeneratedProgramPath)" WriteOnlyWhenDifferent="true" Overwrite="true" />
  </Target>
</Project>
```

I took the inspiration from [this][2] and only slightly modified it.

And although it's cheating in this "competition", it's good to know I can rather easily generate (C#) files from _MSBuild_ and include some values of variables (like version for example).

[1]: https://nietras.com/2021/10/09/worlds-smallest-csharp-program/
[2]: https://gist.github.com/KirillOsenkov/f20cb84d37a89b01db63f8aafe03f19b
