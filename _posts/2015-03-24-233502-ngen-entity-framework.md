---
title: "NGen Entity Framework"
date: 2015-03-24T13:19:00Z
tags:
  - Entity Framework
category: none
layout: post
---
Entity Framework is not an ultra lightweight layer you add to your application (at least not pre-EF7). It contains a lot of features and a lot of code. Before the [Entity Framework was NuGet package][1], it was part of [.NET Framework][2] and hence it was `ngen`ed when you installed some version of .NET Framework. Not with NuGet.

<!-- excerpt -->

The `ngen` tool generates native images, the same way JIT does (give or take). But it does it in advance. Because before it was done for you automatically and now it's not, you're loosing some performance. Although it might be just few milliseconds - better to measure before you start preparing this for big deploy.

Anyway. `Ngen`ing assembly is pretty easy. Just call `ngen install <assembly>` and you're done. But be aware that this generation needs to be done on every machine where your application runs. It's machine dependent, you cannot do it on you development machine and somewhat ship it with application. So you need to plug it into your deploy/install procedures.

Also it's good to know that Entity Framework is not a single assembly. The core it `EntityFramework.dll`. But there are also provider specific assemblies. You've probably seen `EntityFramework.SqlServer.dll` assembly. Similarly you can find `EntityFramework.Firebird.dll`, `EntityFramework.NuoDb.dll` and other assemblies. You can `ngen` these too.

And there's one final gotcha. You need to select appropriate version of `ngen`. I mean not only the framework version (of course), but also the 32bit vs 64bit. So don't miss the `C:\Windows\Microsoft.NET\Framework\v4.0.30319\ngen.exe` vs `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\ngen.exe` (for example).

Once you're done, you can run your application and check with i.e. [Process Explorer][3] that your application loaded `EntityFramework.ni.dll` and other `ni` (`ni` as native image) files.

[1]: https://www.nuget.org/packages/EntityFramework
[2]: http://www.microsoft.com/net
[3]: https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx