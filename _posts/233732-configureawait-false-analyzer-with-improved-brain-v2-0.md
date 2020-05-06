---
title: |-
  ConfigureAwait(false) analyzer with improved "brain" (v2.0)
date: 2018-07-10T13:05:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Roslyn
---
The original [`ConfigureAwaitChecker` tool][1] I wrote was just a concept and I knew it had a lots of limitations. Luckily it idea was not completely dumb (even [Jon Skeet thinks so][2]) and hence when ideas for improvements came in, I was not skipping on these. And because these improvements become quite big, I'm releasing today version 2.0. 

<!-- excerpt -->

The biggest change is that now the analyzer uses also _semantic model_, thus it's able to detect where the `ConfigureAwait` call is possible and where it's not. Below you can see that after upgrading to new version the green squiggle disappears on `Task.Yield()`, while it still works on `Task.Delay(100)`.

![ConfigureAwaitChecker analyzer]({{ include "post_ilink" page "cac.gif" }})

Another improvement is that the analyzer was changed to .NET Standard 1.3 from PCL (as was default in Visual Studio 2015), broadening options where you can use it. And finally, some small big fixes in code fixes were parentheses were not properly adjusted.

As expected, you can [get it from NuGet][3] and give it a spin.

[1]: {{ include "post_link" 233523 }}
[2]: https://github.com/cincuranet/ConfigureAwaitChecker/issues/5
[3]: https://www.nuget.org/packages/ConfigureAwaitChecker.Analyzer