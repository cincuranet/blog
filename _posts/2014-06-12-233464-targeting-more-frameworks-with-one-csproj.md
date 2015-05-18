---
title: "Targeting more frameworks with on csproj"
date: 2014-06-12T08:01:00Z
tags:
  - .NET
  - Visual Studio
redirect_from: /id/233464
category: none
layout: post
---
I don't like doing things twice or more times. And creating builds with `csproj` for multiple frameworks (like .NET 2.0, .NET 3.5, .NET 4.0, .NET 4.5) isn't easy. Bunch of projects I'm following has like `Project_40.csproj`, `Project_45.csproj` and so on. That means you have to maintain two project files when you add, move or remove files. 

Because I don't like managing multiple project files, when I first started building [FirebirdClient][1] for multiple frameworks I simply switched target framework in [Visual Studio][3], switched configuration and did the build. Not exactly a best scenario and actually few times I forgot to do the switch and produced wrong build. I had to double check what I was publishing. 

<!-- excerpt -->

But the `csproj` file is much more than what Visual Studio can set up. And it's pretty easy to have everything under some condition - as I found when trying to juggle references to [Entity Framework][2] assemblies. Given the target framework is part of the project file it was just a question of changing the project file manually and see how Visual Studio will handle it and whether the _Batch Build_ feature will be able to handle it. Long story short. It works (Visual Studio 2013 and tools ([MSBuild][4], ...) comming with Visual Studio 2013). The _Batch Build_ has no problem with it. Visual Studio's IntelliSense is sometimes confused when you switch target framework this way, but that's not a big deal. Restarting Visual Studio solves it immediately, sometimes it solves itself after a while.

So how it's done. The target framework is specified in `TargetFrameworkVersion` element and optionally there's `TargetFrameworkProfile` in case there's some profile (like .NET 4.0 Client). You wrap these into `PropertyGroup` matching your configuration and you're done. Below is a sample comfiguration building under `Release_40` for .NET 4.0 Client and `Release_45` for .NET 4.5.  

<pre class="brush:xml">
&lt;PropertyGroup Condition="'$(Configuration)|$(Platform)' == 'Release_40|AnyCPU'"&gt;
	&lt;OutputPath&gt;bin\Release_40\&lt;/OutputPath&gt;
	&lt;DefineConstants&gt;TRACE;NET_40&lt;/DefineConstants&gt;
	&lt;Optimize&gt;true&lt;/Optimize&gt;
	&lt;DebugType&gt;pdbonly&lt;/DebugType&gt;
	&lt;PlatformTarget&gt;AnyCPU&lt;/PlatformTarget&gt;
	&lt;ErrorReport&gt;prompt&lt;/ErrorReport&gt;
	&lt;CodeAnalysisRuleSet&gt;AllRules.ruleset&lt;/CodeAnalysisRuleSet&gt;
	&lt;Prefer32Bit&gt;false&lt;/Prefer32Bit&gt;
	&lt;TargetFrameworkVersion&gt;v4.0&lt;/TargetFrameworkVersion&gt;
	&lt;TargetFrameworkProfile&gt;Client&lt;/TargetFrameworkProfile&gt;
&lt;/PropertyGroup&gt;
&lt;PropertyGroup Condition="'$(Configuration)|$(Platform)' == 'Release_45|AnyCPU'"&gt;
	&lt;OutputPath&gt;bin\Release_45\&lt;/OutputPath&gt;
	&lt;DefineConstants&gt;TRACE;NET_45&lt;/DefineConstants&gt;
	&lt;Optimize&gt;true&lt;/Optimize&gt;
	&lt;DebugType&gt;pdbonly&lt;/DebugType&gt;
	&lt;PlatformTarget&gt;AnyCPU&lt;/PlatformTarget&gt;
	&lt;ErrorReport&gt;prompt&lt;/ErrorReport&gt;
	&lt;CodeAnalysisRuleSet&gt;AllRules.ruleset&lt;/CodeAnalysisRuleSet&gt;
	&lt;Prefer32Bit&gt;false&lt;/Prefer32Bit&gt;
	&lt;TargetFrameworkVersion&gt;v4.5&lt;/TargetFrameworkVersion&gt;
	&lt;TargetFrameworkProfile&gt;
	&lt;/TargetFrameworkProfile&gt;
&lt;/PropertyGroup&gt;
</pre> 

When I'm not sure what should go into `TargetFrameworkVersion` and `TargetFrameworkProfile` I just copy the values from fresh project. ;)

Obvious trick. Hope it helps you to lower the amount of "manual labor" you need to do when targeting multiple frameworks.

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://msdn.com/ef
[3]: http://www.visualstudio.com/
[4]: http://msdn.microsoft.com/en-us/library/dd393574.aspx