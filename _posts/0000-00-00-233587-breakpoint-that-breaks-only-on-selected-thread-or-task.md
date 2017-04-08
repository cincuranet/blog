---
title: |-
  Breakpoint that breaks only on selected thread or task
date: 2016-12-09T10:46:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Visual Studio
  - .NET
  - .NET Core
layout: post
---
Few weeks ago on my "parallel-async-threading" deep dive course somebody asked a question whether it's possible to make breakpoint work only on a specific thread. That's a pretty valid request, especially if we talk about running the same algorithm on a huge amount of data. Let's have a look at it.

<!-- excerpt -->

#### Conditional breakpoint

One option is to create a conditional breakpoint. What's conditional breakpoint? It's a breakpoint that has a boolean condition attached and before it breaks (or not) the condition is evaluated. This has been in Visual Studio for years. Right clicking on a regular breakpoint shows you a menu, where you can select such item and then set it up. Something like on this picture.

![Conditional breakpoint](/i/233587/conditional_breakpoint.png)

I'm using the [`Thread.CurrentThread.ManagedThreadId` property][1] to break only on selected thread. For tasks I can use [`Task.CurrentId` value][2].

Although this works fine, it has one problem. Every time you start your application the ID numbers are very likely going to differ. And you are going to spent few minutes fixing all of these breakpoints. Not fun. Of course one might build (or maybe there already is) an extension for that. But that's not necessary. 

#### Using the `Break` method

Instead of hardcoding the value into the condition you can create a field for it and use that. Great idea. And you can stretch it even a bit further. Let's wrap it to a nice object!

```csharp
public static class SimpleThreadBreakpoint
{
    static int _threadId;

    public static void Break()
    {
        if (Volatile.Read(ref _threadId) == Thread.CurrentThread.ManagedThreadId)
            Debugger.Break();
    }

    public static void ThisThread()
    {
        Volatile.Write(ref _threadId, Thread.CurrentThread.ManagedThreadId);
    }
}
```

With this class I can do `SimpleThreadBreakpoint.ThisThread` call whenever I want to select current thread (or task with a simple modification) as being the one where breakpoints will break. Then instead of (conditional) breakpoint (or regular [`Debugger.Break` call][3]) I'm going to use `SimpleThreadBreakpoint.Break`. Instant win!

The call to `ThisThread` might be in my code on a place where I'm in a known state or simply while debugging, let's say from _Immediate Window_.

Finally the `Break` method might be conditionally compiled out, so you can keep the code there but not affecting the production builds.

#### Summary

At the end both methods are basically the same. Same result, different approach. 

Also bear in mind that extra code there (especially because of _volatile_ reads and writes) might affect how the code runs and thus some race conditions or deadlocks or ... might not happen. 

[1]: https://msdn.microsoft.com/en-us/library/system.threading.thread.managedthreadid(v=vs.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/system.threading.tasks.task.currentid(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.diagnostics.debugger.break(v=vs.110).aspx