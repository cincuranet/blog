---
title: |-
  Decimal tearing example on .NET/.NET Core
date: 2017-03-19T19:25:00Z
tags:
  - .NET
  - .NET Core
  - C#
layout: post
---
> I realized I have some pieces of code to show some specific behavior, mostly around threading and synchronization, all over my notes. Some of these pieces may be 10+ years old. I use these pieces during my "threading/parallel/async" course, but why not to share it publicly. Maybe I'll stumble on it after some years, maybe .NET will be history, and it will be interesting to re-read and re-think the code. The code isn't unique or something where I'm the first to realize it. It's really just an example code.

Here's the most recent one. I wanted to show torn reads happening. So I took a `decimal` value, because it is 128-bit value it will not be atomic in any way, and started looping using plain reads and writes. 

<!-- excerpt -->

```csharp
static class Program
{
    const decimal Value1 = 1;
    const decimal Value2 = 9999999999999999999;
    static readonly TimeSpan Delay = TimeSpan.FromMilliseconds(100);

    static decimal value;

    static void Main(string[] args)
    {
        Console.WriteLine(FrameworkVersion);

        var writer = new Thread(_ => Writer());
        writer.Start();
        var reader = new Thread(_ => Reader());
        reader.Start();

        Console.ReadLine();
    }

    static void Writer()
    {
        while (true)
        {
            value = Value1;
            value = Value2;
        }
    }

    static void Reader()
    {
        var sw = Stopwatch.StartNew();
        while (true)
        {
            var t = value;
            if (t != Value1 && t != Value2)
            {
                Console.WriteLine($"{sw.Elapsed}: {t}");
                Thread.Sleep(Delay);
            }
        }
    }

    static string FrameworkVersion =>
#if NETCOREAPP1_1
        System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription;
#else
        Environment.Version.ToString();
#endif
}
```

Running this code with full optimizations (aka _Release_ build) it starts "failing" pretty quickly (just a few seconds on my machine). And on my machine the torn values are `2313682943` or `9999999997686317057` (yours might vary).

At the time of writing it works successfully on good old .NET Framework `4.0.30319.42000` and also .NET Core `4.6.25009.03` using `netcoreapp1.1`.

> [Follow-up post.][1]

[1]: {% include post_link id="233626" %}