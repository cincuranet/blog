---
title: |-
  Checking for ConfigureAwait(false) as Visual Studio 2015 analyzer
date: 2015-08-22T09:30:00Z
tags:
  - .NET
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Roslyn
layout: post
---
Sometime ago I wrote - actually looking at the post date it's already a year, give or take - a [`ConfigureAwaitChecker` tool][1]. It was partly because I needed tool like that and also I wanted to investigate [Roslyn][2]. Perfect combination. 

I used the tool quite a few times, but it was not smooth. Going out of Visual Studio, running it and then manually finding the errors in source code back in Visual Studio. Not a best experience. I think sometimes I even skipped using my own tool because of this. When Visual Studio started having final shape the concept of _analyzers_ (and also _code fixes_) was introduced ([[1][3]], [[2][4]]). The idea of NuGet distribution looked nice, better than VSIX (expecially if you want to have it per project and for everybody in particular project). I was sold.

<!-- excerpt -->

Because of my limited time I was waiting for RTM to publish the [`ConfigureAwaitChecker.Analyzer`][6]. The source code is available on [GitHub][5].

I recommend you to read my [previous post][1], because the analyzer is based on that code with only some small modifications. And the limitations are still the smae. So it's better to understand the background before jumping in and drowning.

The code fixes were new and I found them harder to implement. Not only you need to detect something is wrong, but also you have to detect how it's wrong and what to do to fix it. And I quickly realized there's dozens of variations somebody can write basic expressions (i.e. imagine how you can write braces and still have the "same" expression) and all these need to be properly fixed. I spent some time testing my code fixes, but I'm pretty sure there's currently bunch of cases where the code fix produces code that is going to need some manual polishing. Feel free to report these (and you can also PR the fix). <small>(I originally developed the "checker" before this feature thus I have bunch of regular tests for the "checker" itself. Not for the analyzer integration (proper squiggles, ...). And none for code fixes. It's on to-do. :))</small>

Here's how it looks like in real.

![image](/i/233523/cac.png)

Also some a small caveat. There's a `ConfigureAwaitChecker` package available. It's a fork of my original code (using the console app, just plugged into Visual Studio). I think it would be nice to use this package ID (even though the name containing "Analyzer" explicitly states what it is - I don't know, let me know) I tried contacting the author already few weeks ago, but so far no reply. 

[1]: {% include post_id_link.txt id="233476" %}
[2]: https://github.com/dotnet/roslyn
[3]: https://msdn.microsoft.com/en-us/magazine/Dn879356.aspx
[4]: http://www.pluralsight.com/courses/vs-2015-diagnostic-analyzers-first-look
[5]: https://github.com/cincuranet/ConfigureAwaitChecker
[6]: https://www.nuget.org/packages/ConfigureAwaitChecker.Analyzer