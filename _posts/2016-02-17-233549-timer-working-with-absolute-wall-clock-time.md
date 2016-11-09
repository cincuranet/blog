---
title: "Timer working with absolute - wall clock - time"
date: 2016-02-17T10:36:00Z
tags:
  - .NET
  - Windows
  - C#
layout: post
---
From time to time I need to create some kind of scheduler for recurring stuff in application. As long as it's based on interval I can use the [`Timer`][1]. But when you need to trigger the action on specific time - wall clock time - it's not smooths sailing. There's a bunch of ways to tackle the problem and each presents different obstacles (like time changes due to NTP synchronization). But this is already solved in Windows kernel. Windows allow you to use timers with either absolute time or intervals.

<!-- excerpt -->

Sadly the absolute time timer is no exposed directly in .NET. So after years of hacking my way around using pure .NET solution I decided to go P/Invoke and use the one from Windows. And I decided to create a "component" from it.

You can find the sources [here][2] and download it from [NuGet][3].

It's really just a thin wrapper around [ThreadPoolTimer][4]. So far I exposed only the bare minimum that makes it working "absolute" timer without any fancy features (i.e. the `msWindowLength` parameter). If people find it useful I'll start adding more (PRs accepted).

Here's a (really) simple example of how to use it.

```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(DateTime.Now);
        using (var timer = new AbsoluteTimer.AbsoluteTimer(DateTime.Now.AddMinutes(1), Tick, null))
        {
            Console.ReadLine();
        }
    }

    static void Tick(object state)
    {
        Console.WriteLine(DateTime.Now);
    }
}
```

[1]: https://msdn.microsoft.com/en-us/library/system.threading.timer(v=vs.110).aspx
[2]: https://github.com/cincuranet/AbsoluteTimer
[3]: https://www.nuget.org/packages/AbsoluteTimer
[4]: https://msdn.microsoft.com/en-us/library/windows/desktop/ms682466(v=vs.85).aspx