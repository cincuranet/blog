---
title: |-
  New Environment.ProcessId in .NET 5
date: 2020-11-04T13:14:00Z
tags:
  - .NET
---
While reading some code in .NET runtime, I found `Environment.ProcessId` property, which surprised me a bit, because I had no idea it existed. Quick look into the documentation and no wonder I had no idea. It's new in .NET 5. 

<!-- excerpt -->

If you wanted to get _process id_ of current process, the easiest way, same way all the way back to stone age days of .NET, was `Process.GetCurrentProcess().Id`. And there's nothing wrong with it, but creating a whole `Process` class instance to get just the _process id_ is little bit overkill. 

With .NET 5 you can use the new [`Environment.ProcessId`][2], which in turn uses interop call into OS and caches the value. Because as long as the process is running the _process id_ is set, so why not, right? Not creating the instance wastefully and also caching the value is great performance benefit.

Added to, even if you use the `GetCurrentProcess`, you'll get the benefit of caching, because the ` Environment.ProcessId` is used there.

The "inner" implementation is the same as was before (at least recent "before"). I.e. on Windows it calls `unchecked((int)Interop.Kernel32.GetCurrentProcessId())` or on Linux `Interop.Sys.GetPid();`. The `GetPid`, to pick one, calls [`getpid`][1] via `SystemNative_GetPid`. Nothing unordinary.

I like these "small and hidden" improvements, maybe even more than the "big and flashy" ones.

[1]: https://man7.org/linux/man-pages/man2/getpid.2.html
[2]: https://docs.microsoft.com/en-us/dotnet/api/system.environment.processid?view=net-5.0#System_Environment_ProcessId