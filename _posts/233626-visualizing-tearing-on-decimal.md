---
title: |-
  Visualizing tearing on decimal 
date: 2017-05-30T15:03:00Z
tags:
  - .NET
  - .NET Core
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Today, as I'm [teaching my][2] parallel/threading/async course, I was showing how the tearing on reads happens. I used the same [code I published couple of months ago][1]. And then idea came (yes, it happens sometimes ;)). I wanted to show that the `decimal`, being 128-bit structure, splits on underlying values. Here's the code.

<!-- excerpt -->

The code is mostly the same as the [original][1] one. I just used `decimal.MaxValue` and `0` as values to have some nice bits and simple method (`GetDecimalBits` in the code) to get me these bits as string.

```csharp
static class Program
{
    const decimal Value1 = decimal.MaxValue;
    const decimal Value2 = 0;
    static readonly TimeSpan Delay = TimeSpan.FromMilliseconds(100);

    static decimal value;

    static void Main(string[] args)
    {
        Console.WriteLine(FrameworkVersion);

        Console.WriteLine(GetDecimalBits(Value1));
        Console.WriteLine(GetDecimalBits(Value2));

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
                Console.WriteLine($"{sw.Elapsed}: {t} {GetDecimalBits(t)}");
                Thread.Sleep(Delay);
            }
        }
    }

    static string GetDecimalBits(decimal value)
    {
        var bits = decimal.GetBits(value);
        return $"{bits[3]:X8}{bits[2]:X8}{bits[1]:X8}{bits[0]:X8}";
    }

    static string FrameworkVersion =>
#if NETCOREAPP1_1
    System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription;
#else
    Environment.Version.ToString();
#endif
}
```

Running this on .NET Core (but works fine on .NET as well) shows nicely the splitting happening (again full optimizations need to be turned on).

```text
.NET Core 4.6.25211.01
00000000FFFFFFFFFFFFFFFFFFFFFFFF
00000000000000000000000000000000
00:00:00.0000036: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:00.1003531: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:00.2005971: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:00.3008787: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:00.4011402: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:00.5014158: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:00.6022055: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:00.7030075: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:00.8037584: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:00.9041407: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:01.0049634: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:01.1058126: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:01.2062336: 79228162495817593524129366015 00000000FFFFFFFF00000000FFFFFFFF
00:00:01.3063833: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
00:00:01.4071562: 79228162495817593519834398720 00000000FFFFFFFF0000000000000000
```

What a nice result. The [underlying values][3] are clearly visible (the boundaries between them). 

[1]: {{ include "post_link" 233602 }}
[2]: /about
[3]: https://referencesource.microsoft.com/#mscorlib/system/decimal.cs,145