---
title: "Cancel CancellationTokenSource after a timeout"
date: 2013-01-24T09:26:20Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233152
category: none
layout: post
---
Maybe you already discovered it. But in .NET 4.5 the [`CancellationTokenSource`][1] class has a new method [`CancelAfter`][2]. It allows you to signal cancellation after a specified interval aka timeout.

<!-- excerpt -->

In .NET 4 you'd have to [`Wait`][3] on a [`Task`][4] to complete or not and if not, do the cancellation. This might go little bit off control if you have a bunch of tasks. In .NET 4.5 a handy [`Task.Delay`][5] was added and with `await`/`async` it was easier. But still.

Setting a timeout and basically forgetting about it is a nice little help, that will make the code little more clean and easier to comprehend.

[1]: http://msdn.microsoft.com/en-us/library/dd321629.aspx
[2]: http://msdn.microsoft.com/en-us/library/hh194678.aspx
[3]: http://msdn.microsoft.com/en-us/library/dd235604.aspx
[4]: http://msdn.microsoft.com/en-us/library/dd235678.aspx
[5]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.delay.aspx