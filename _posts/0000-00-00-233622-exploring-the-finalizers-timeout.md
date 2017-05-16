---
title: |-
  Exploring the finalizers' timeout
date: 2017-05-16T07:48:00Z
tags:
  - .NET
  - .NET Core
layout: post
---
I don't know why, but last week I decided to check whether the 2 seconds timeout for single finalizer and 40 seconds for all finalizers at the end of .NET application are still in place. If you haven't heard about these two numbers ever, don't worry. Because if you've ever hit one or the other you've been doing something seriously wrong. That's how I've got to learn about it as well. ;)

<!-- excerpt -->

#### Background

Any object in .NET can have a finalizer. That's the method that has the same name as the object itself prepended by `~`. This method should be used to clean up some unmanaged resources as a last resort (although the [`SafeHandle`][1] and related should be probably used in the first place). Whenever the _garbage collector_ finds this object to be ready to be cleaned up, it puts it into _finalization queue_ and later _finalizer thread_ will go through this queue and call the finalizer for every object there. Same logic applies when application is closing, at least in .NET (more info further), with only one difference. Single finalizer can run at most 2 seconds and total time for all finalizers can't exceed 40 seconds. It's easy to see why. Without any limits the application could stuck there forever.

#### Single finalizer

Testing one finalizer is easy. Just make an object with finalizer with infinite loop, allocate it and let the application exit.

```csharp
class Program
{
    static void Main(string[] args)
    {
        new FinalizeSingle();
    }
}

class FinalizeSingle
{
    ~FinalizeSingle()
    {
        var cnt = 0;
        while (true)
        {
            Console.WriteLine(++cnt);
            Thread.Sleep(100);
        }
    }
}
```

This code, in _Release_ build, puts in most cases `19` on the console as a last number. Which confirms the 2 seconds limit is there.

#### Multiple finalizers

For total time I just need to allocate enough object to potentially go over 40 seconds and have some shared counter. 

```csharp
class Program
{
    static void Main(string[] args)
    {
        var data = new FinalizeMultiple[1000];
        for (int i = 0; i < data.Length; i++)
        {
            data[i] = new FinalizeMultiple(i.ToString());
        }
    }
}

class FinalizeMultiple
{
    static int cnt = 0;

    string _index;

    public FinalizeMultiple(string index)
    {
        _index = index;
    }

    ~FinalizeMultiple()
    {
        Console.WriteLine($"{_index}: {++cnt}");
        Thread.Sleep(100);
    }
}
```

The shared `cnt` acts as my counter and I also added an "index" for object to see in what's the order (not that one should **ever** rely on that). This run gives numbers around `375` again confirming that something like 40 seconds limit is there.

What's interesting is, that if I put a loop into the finalizer to spent some more time there, even if I don't exceed the 2 seconds timeout, the whole finalization is killed after 2 seconds. I played with the sleep delay and number of iterations and looks like .NET can see there's not enough progress happening and calls it a day. Interesting.

#### .NET Core

Finally what about .NET Core? Does the same apply there? Nope. Both examples above end immediately as the applications exits. Which to me seems like a good behavior. The finalizers should only cleanup unmanaged resources and as the application exists the OS will do that anyway. [Here][2] is more info about that.

#### Closing

During the normal life of the application all finalizers are of course executed no matter what. The timeout is only for shutdown on .NET. Easy to confirm by adding these two lines after the allocations (and again, these methods shouldn't be in in production code ever). 

```csharp
GC.Collect();
GC.WaitForPendingFinalizers();
```

I don't know why these internals fascinate me but they do. Hope you find it interesting to read as well.

[1]: https://msdn.microsoft.com/en-us/library/system.runtime.interopservices.safehandle%28v=vs.110%29.aspx
[2]: https://github.com/dotnet/corefx/issues/5205