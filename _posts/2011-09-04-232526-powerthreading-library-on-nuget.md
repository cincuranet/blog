---
title: "PowerThreading library on NuGet"
date: 2011-09-04T07:11:16Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - NuGet
redirect_from: /id/232526/
category: none
layout: post
---
I like [NuGet][1] because it removes the hassle of downloading and installing libraries. And sadly only small number of vendors is providing just package without installer. And I also like parallel/multithreaded programming. Crucial tool in my toolbox for parallel programming is Jeffrey Richter's ([Wintellect][2]) [PowerThreading][3] library. The library is great and contains a lot of smart ideas <small>(In fact the [async/await feature in C# 5][4] uses similar concept as `AsyncEnumerator`.)</small> and some handy objects too. And it's completely _free_.

Sadly it was not on NuGet. Hence I took the challenge and [created the package][5]. It's called simply [PowerThreading][5]. Don't take me wrong, Jeffrey is doing great job with this library and I'm and will be happy to maintain the package. He's too smart to waste his time on this; spending rather the time on improving it, is more valuable.

[1]: http://nuget.org
[2]: http://wintellect.com/
[3]: http://wintellect.com/powerthreading.aspx
[4]: http://msdn.microsoft.com/en-us/vstudio/gg316360
[5]: http://nuget.org/List/Packages/PowerThreading