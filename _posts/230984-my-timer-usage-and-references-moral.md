---
title: |-
  My Timer usage and references moral
date: 2009-10-29T22:41:01Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
---
Few minutes ago I got flash of intelligence. I'm using [Timer][1] in one of my windows service running simply 24×7. And I had a bug getting wrong data on server that I was not able to reproduce locally. Same data, same code, nothing. That was pretty weird, because after roughly four days I restarted the service and it started working correctly.

I opened a debugger, started the service locally and went for some candy. Because the data should be refreshed by default every two minutes, when I came back I realized, that the refresh procedure was not run, because there was a breakpoint, but no hit. So I started looking for some info in documentation, when suddenly the note followed by recalling the knowledge came in:

> As long as you are using a Timer, you must keep a reference to it. As with any managed object, a Timer is subject to garbage collection when there are no references to it. The fact that a Timer is still active does not prevent it from being collected.

Yep, I was creating the instance but I was not holding a reference to it, so in under the refresh interval it was garbage collected. : Shame on me. But. We learn by mistakes.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.timer.aspx