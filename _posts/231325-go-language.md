---
title: |-
  Go language
date: 2010-04-14T20:18:20Z
tags:
  - Go
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Programming in general
---
I was looking at [Go language presentation][1] now.

The first stuff that took my attention was the C-like syntax. I really don't like it. I want my language to talk to me. There's, IMO, no reason in todays world to have identifiers and symbols from only couple of characters and using a lot of different characters from various places on keyboard.

Anyway what was interesting for me was the concept of _channels_, especially the mapping the to threads and attempt to effectively use system resources. The [APM (Asynchronous Programming Model)][2] and/or new [Tasks][3] both looks similar to channels - at least from the view what it's offering, not how it's exposed into language.

I don't know about internals. But I'm sure, that the threading and parallelism attempts to get some reasonable programming model(s) are exponentially growing.

[1]: http://www.youtube.com/watch?v=rKnDgT73v8s
[2]: http://msdn.microsoft.com/en-us/magazine/cc163467.aspx
[3]: http://msdn.microsoft.com/en-us/library/dd235608(v=VS.100).aspx