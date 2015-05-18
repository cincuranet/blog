---
title: "How slow the \"lock\" statement actually is? - part 2"
date: 2014-10-29T11:36:00Z
tags:
  - C#                
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233485
category: none
layout: post
---
After measuring the [`lock` statement][2] compared to naked [`Monitor`][3] calls I got some remarks about my code not being equivalent. Of course it's not. If it would be equivalent the time would be (should be) same. I wrote it as I did because I think there are some problems with the `lock` statement. 

<!-- excerpt -->

Actually it's only one problem, but with two consequences. Let me start with the one that's more about what you think should be correct.

#### Consequence 1

The `lock` is translated into `try`-`finally` block. And in the `finally` block the lock is released no matter what, that's the nature of `finally` block. When everything goes smoothly it's fine. But once there's unhandled exception the lock will be released. As if the unhandled exception wasn't enough. 

A small side step. I also believe that executing a code inside lock that might throw exception is bad idea. You need to get in and out quickly. Set some variables and done. Minimum time there.

Because you unhandled the exception there's a really good chance that your state is corrupted (why else would you do that in a first place). Corrupted state is nightmare. Weird bug will pop up minutes or hours later. You'll be very confused where that happened etc. In a worst case scenario you'll corrupt or loose users' data. On the other hand without the finally the program would very likely deadlock, because there's nobody to release that lock. I believe deadlock is far better than the previous behavior. First when debugging you'll spot it pretty quickly. It's easy to see whether it happened now or not. Also the user - if somewhat UI related -  will see the program is not progressing. He or she will then anticipate the worst - the data loss and can handle that situation a bit (like remember what was typed in before killing the application; doing a screenshot; copying, even opened, files just for luck; ...). 

Of course we might argue what's worse or what's more likely. I believe in deadlocks. ;)

#### Consequence 2

This one is only partially true as I proved to myself in [previous post][1]. The `finally` block is not cheap. The CLR guarantees a lot of stuff for `finally` blocks - like that it's always executed (except when you unplug your computer from the wall socket :D). And all the guarantees come with price.

I proved that in 32bit builds. Much less in 64bit, though.

Given that you often use multithreaded parallel algorithm to make your code run faster, you care about how long the lock is held. Contention, starving, trashing, ... All this matters when you care about performance. I agree on premature optimization. But I also don't want to waste resources by writing code that might have been better from the start.

#### Summary

I agree these reasons are not black and white. That's probably also why the `lock` statement exists - there's not a definitive truth. And you can easily burn seconds using wrong locking or wrong algorithm (not mentioning not having [shared state][4] might be way better anyway). The nano- and microseconds gained here might really be insignificant.

Although I'd like to hear your opinions on this topic. 

[1]: {{ site.url }}{% post_url 2014-10-26-233484-how-slow-the-lock-statement-actually-is %}   
[2]: http://msdn.microsoft.com/en-us/library/c5kehkcz.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.monitor(v=vs.110).aspx
[4]: http://en.wikipedia.org/wiki/Concurrent_computing#Coordinating_access_to_shared_resources