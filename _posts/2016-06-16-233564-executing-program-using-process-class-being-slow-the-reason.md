---
title: |
  Executing program using Process class being slow - the reason
date: 2016-06-16T09:42:00Z
tags:
  - .NET
  - Windows
layout: post
---
We have a program that sends emails to clients based on what happens at business side. Pretty simple - you register, you got welcome email; and so on. And there's a lot of these "actions". When I wrote the program few years back I tested it and I was able to peak at about 3500 email per second. Should be plenty enough. But recently the queue started to get longer. Emails were processed later. And everything started to behave oddly.

<!-- excerpt -->

To make the story short I've spent more than half of the day trying to find what's wrong. Ranging from database optimizations (helped a little), blaming slowness of logging framework (and I do log a lot) to testing thread pool and asynchronous IO behavior under heavy load (that was dead end as nothing else :)). Nothing convincing.

Eventually, collecting the breadcrumbs, I realized the process is running somewhat slow while hosted in the "host" application compared to when running it directly. Let me explain a little. The host application I'm talking about here is a service we use for running other applications. It has some custom restarting policies, notifications, monitoring etc. built in. And it's also collecting the output (in case of console applications).

The host starts the programs using regular [`Process`][1] class from .NET, then immediately calling [`BeginOutputReadLine`][2] and waiting for [`OutputDataReceived` events][3]. While handling this event I was first using some locking and also doing some operations on strings. As it turned out while the event handler is running no other lines from output are processed and hence the underlying program is writing to console slowly.

Doing as little as possible in the `OutputDataReceived` event handler solved it immediately. In fact it was running even faster than in regular console (in my case), because I was doing almost nothing there really.

Fix has been deployed for about a day now and it seems to be running fine. Now to the [next issue][4].

[1]: https://msdn.microsoft.com/en-us/library/system.diagnostics.process%28v=vs.110%29.aspx
[2]: https://msdn.microsoft.com/en-us/library/system.diagnostics.process.beginoutputreadline(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.diagnostics.process.outputdatareceived(v=vs.110).aspx
[4]: https://twitter.com/cincura_net/status/742958997699997696