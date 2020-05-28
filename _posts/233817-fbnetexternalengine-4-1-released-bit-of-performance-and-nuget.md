---
title: |-
  FbNetExternalEngine 4.1 released - bit of performance and NuGet
date: 2020-03-31T11:47:00Z
tags:
  - Firebird
  - .NET
---
[_FbNetExternalEngine_][1] version 4.1 is released. Although it might look odd having another release so close after the previous, it's not a bug-fix release. In fact when I released 4.0 I knew 4.1 is probably going to happen soon after. The reason is, I had some performance optimizations prepared, but didn't had enough numbers to safely put into production. Now I have.

<!-- excerpt -->

The already mentioned performance improves performance little bit and reduces some unnecessary allocation in the execution path. Less allocations reduce GC pressure and might improve GC pauses.

If you're using `FbNetExternalEngineIntegration.dll`, you can now get it from NuGet as a [`FbNetExternalEngine.Integration`][2], simplifying referencing it.

[1]: /tools/fb-net-external-engine
[2]: https://www.nuget.org/packages/FbNetExternalEngine.Integration