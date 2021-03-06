---
title: |-
  AsyncLocal<T> in .NET 4.6
date: 2015-08-25T05:39:00Z
tags:
  - C#
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
.NET 4.6 contains new handy [class `AsyncLocal<T>`][1]. It's something like thread-local or TLS. Basically the value you set continues with the asynchronous operation even if you change it as the operation is running.

<!-- excerpt -->

Let's have a look how it works. I'll create an extremely simple code that will use simple variable, `AsyncLocal<T>` and [`ThreadLocal<T>`][2] (just to compare).

```csharp
static int _variable;
static AsyncLocal<int> _asyncLocal = new AsyncLocal<int>();
static ThreadLocal<int> _threadLocal = new ThreadLocal<int>();

static async Task Test()
{
    Console.WriteLine($"T={Thread.CurrentThread.ManagedThreadId}");
    _variable = 1;
    _asyncLocal.Value = 1;
    _threadLocal.Value = 1;
    var o1 = Output("1");
    _variable = 2;
    _asyncLocal.Value = 2;
    _threadLocal.Value = 2;
    var o2 = Output("2");
    await Task.WhenAll(o1, o2);
}

static async Task Output(string name)
{
    await Task.Delay(1000);
    Console.WriteLine($"{name}: T={Thread.CurrentThread.ManagedThreadId}, V={_variable}, AL={_asyncLocal.Value}, TL={_threadLocal.Value}");
}
```

When you run it you'll see the difference in values (and probably thread IDs).

```text
T=1
2: T=4, V=2, AL=2, TL=0
1: T=5, V=2, AL=1, TL=0
```

The value of `_variable` is `2` because that's the last value we set before the operation outputs something. Clear. The `_asyncLocal` contains expected value(s). As you start asynchronous operation the current state is captured and then it's passed along as the operation is executing. And then again for next operation. Even if you'd set the value after the `Output("2")` call (which thanks to the delay would really happen before showing the value), the value for that operation is unchanged. Finally the `_threadLocal`, which contains always value `0`, because each operation runs in new thread (although it might be same thread for both - try few runs and you'll be able to hit that case).

`AsyncLocal<T>` has also an event to get notification when the value was changed (or if `ExecutionContext` was changed, in which case the `ThreadContextChanged` is `true`).

If you're wondering how it works under the hood, it's no magic. There's already a concept for it surfaced in [`ExecutionContext` class][3]. And that's exactly what's used.

In some cases it might help you to avoid locking and have simpler code.

##### Update (Nov 2015)

[Webucator][4] made a video from this article.

<iframe width="560" height="315" src="https://www.youtube.com/embed/i0Hl5ebNkaA" frameborder="0" allowfullscreen></iframe>

[1]: https://msdn.microsoft.com/en-us/library/Dn906268(v=VS.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/dd642243(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.threading.executioncontext(v=vs.110).aspx
[4]: https://www.webucator.com/