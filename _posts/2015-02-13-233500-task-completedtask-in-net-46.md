---
title: "Task.CompletedTask in .NET 4.6"
date: 2015-02-12T05:39:00Z
tags:
  - C#
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233500/
layout: post
---
I wrote about fast path optimizations with having already completed task prepared before in my ["Better "cached completed Task""][2]. At that time the was no way to directly access already completed `Task` the TPL has. 

Although you could do it using the trick described [there][2], it was really looking cryptic for somebody reading the code. You could wrap it into your own well-named property, but you know...

<!-- excerpt -->

Luckily in .NET 4.6 the before `internal` [`Task.CompletedTask`][1] property is now `public`. It's not that it will make your code faster than before. Really not. It's just ready there for you to use. And because of the name the code will also look more self-descriptive.

Now to just wait for .NET 4.6 to RTM.

[1]: https://msdn.microsoft.com/en-us/library/system.threading.tasks.task.completedtask%28v=vs.110%29.aspx
[2]: {% post_url 2014-05-08-233455-better-cached-completed-task %}