---
title: |-
  Timer instance and race condition
date: 2013-11-20T07:54:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Best practice or not?
  - Lessons learned
---
I'm spending now a lot of time working with [`Timer`][1] object. It's a class with such a simple surface, but there's still a lot to learn. How it works internally, the scheduling, ... This time I learned, luckily not the hard way, just by studying, about interesting race condition, I never though about.

<!-- excerpt -->

Let's imagine you want to schedule operation every 10 seconds and the execution time does not count into interval. You will use the "kicking" trick (I blogged about it little [here][2] and [here][3]):

```csharp
var timer = default(Timer);
timer = new Timer(_ =>
{
	Console.WriteLine("Tick");
	//...
	timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
}, null, TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
```

Looks good, right? Compiles. Runs fine. Or ... You probably know there's a catch. Else the blog post would not mention race condition. It runs fine in 99,99999% cases (100% for me so far ;)). The problem is, that the `timer.Change` call could happen _before_ the assignment on `L2`. Who would have thought that. :)

When I first saw it on Jeffrey Richter's screen it was so clear to me. So easy. But honestly, I never thought about it.

Thus the correct way it to write:

```csharp
var timer = default(Timer);
timer = new Timer(_ =>
{
	Console.WriteLine("Tick");
	//...
	timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
}, null, Timeout.InfiniteTimeSpan, Timeout.InfiniteTimeSpan);
timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
```

 Never mind. Every day I learn something new, is a good day.

And what about you? Do you do the "safe" assignment or assign directly?

[1]: http://msdn.microsoft.com/en-us/library/system.threading.timer(v=vs.110).aspx
[2]: {{ include "post_link" 233425 }}
[3]: {{ include "post_link" 232782 }}