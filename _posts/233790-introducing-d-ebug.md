---
title: |-
  Introducing D.ebug
date: 2019-07-10T08:59:00Z
tags:
  - .NET
  - .NET Core
  - Debugging
---
Lately I've been doing a lot of debugging often in code that needs to be executed certain way, from certain place and sometimes is also modified post-build a little. And sometimes more stuff, which I'll not bother you with. And this makes debugging a tiny bit more difficult.

<!-- excerpt -->

My often-used technique is to employ [`Debugger` class][5] from `System.Diagnostics` namespace. This allows you to launch debugger (by using [`Launch`][3]) when needed and also put breakpoint in the code (in my case often with some condition (yes, I know about conditional breakpoints)) (by using [`Break`][4]). And although everything works great with these two, I have basically two problems with these.

The first one is that I have to add `System.Diagnostics` into `using`s and also later remove it when done. Which sucks if you're trying to poke the thing and see what breaks and then connect the dots. Or I have to use the whole name, which sucks even more.

And the second is that I have to distinguish between the `Launch` and `Break`. And at the beginning I often don't have clear picture of what I'm doing and hence I don't know what path the code will go through.

These two little niggles (and some other small ones) made me create _D.ebug_. It's a extremely simple static class (`D`) with a single method (`ebug`) in a global namespace. It allows me to use anywhere without messing up with `using`s or writing long names. It also uses [`IsAttached` property][6] to decide whether to `Break` or `Lanuch`. Adn that's what I often want. Stop at "this" line - either really just stopping the debugger or offering me to attach it if it's not already attached. To make the stopping bit more smooth it also uses `DebuggerHidden` attribute.

It's built for `net40`, `netstandard1.0` and `netstandard2.0` and available on NuGet as, wait for it, [_D.ebug_][1].

Hope you'll find it useful and feel free to [bring][2] your ideas.

[1]: https://www.nuget.org/packages/D.ebug
[2]: https://github.com/cincuranet/D.ebug
[3]: https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.debugger.launch
[4]: https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.debugger.break
[5]: https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.debugger
[6]: https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.debugger.isattached