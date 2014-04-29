---
title: "Timer instance and race condition"
date: 2013-11-20T07:54:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Best practice or not?
  - Lessons learned
category: none
layout: post
---
I'm spending now a lot of time working with <a href="http://msdn.microsoft.com/en-us/library/system.threading.timer(v=vs.110).aspx">`Timer`</a> object. It's a class with such a simple surface, but there's still a lot to learn. How it works internally, the scheduling, ... This time I learned, luckily not the hard way, just by studying, about interesting race condition, I never though about. 

<!-- excerpt -->

Let's imagine you want to schedule operation every 10 seconds and the execution time does not count into interval. You will use the "kicking" trick (I blogged about it little <a href="{{ site.url }}{% post_url 2013-10-23-233425-scheduling-absolute-time-operations-with-timer %}">here</a> and <a href="{{ site.url }}{% post_url 2012-04-05-232782-executing-method-in-intervals-good-and-bad-approaches %}">here</a>):

<pre class="brush:csharp">
var timer = default(Timer);
timer = new Timer(_ =&gt;
{
	Console.WriteLine("Tick");
	//...
	timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
}, null, TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
</pre>

Looks good, right? Compiles. Runs fine. Or ... You probably know there's a catch. Else the blog post would not mention race condition. It runs fine in 99,99999% cases (100% for me so far ;)). The problem is, that the `timer.Change` call could happen _before_ the assignment on `L2`. Who would have thought that. :)  

When I first saw it on Jeffrey Richter's screen it was so clear to me. So easy. But honestly, I never thought about it.

Thus the correct way it to write:

<pre class="brush:csharp">
var timer = default(Timer);
timer = new Timer(_ =&gt;
{
	Console.WriteLine("Tick");
	//...
	timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan);
}, null, Timeout.InfiniteTimeSpan, Timeout.InfiniteTimeSpan);
timer.Change(TimeSpan.FromSeconds(10), Timeout.InfiniteTimeSpan); 
</pre>

 Never mind. Every day I learn something new, is a good day.

And what about you? Do you do the "safe" assignment or assign directly? 
