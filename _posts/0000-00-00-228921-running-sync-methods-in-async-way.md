---
title: |-
  Running sync methods in async way
date: 2009-01-17T13:00:00Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
Probably you heard about the very good library called [Power Threading Library][1]. Shortly, it allows you to run async methods in a near-sync-looking code (and besides provides some useful classes for working in multithreaded environment). But the problem is, that you have to use methods ready for async way. That easy for dtabase calls or web service calls. But you may have your own code and you want to utilize this library to really burn up your CPU.

The obvious way is to define a delegate and use BeginInvoke/EndInvoke. However that's not what I was interested in. Thus I created some helper methods to use _any_ method you have in async way with [Power Threading Library][2]. Interesting fact is that's also faster than using delegate (Jeffrey mentioned, more info [here][3]).

```csharp
using System;
using System.Threading;
using Wintellect.Threading.AsyncProgModel;
public class AsyncEnumeratorSyncHelper
{
    private AsyncEnumeratorSyncHelper()
    { }
    public static AsyncResult<T> BeginHelper<T>(AsyncCallback callback, object state, Func<T> method)
    {
        AsyncResult<T> ar = new AsyncResult<T>(callback, state);
        Action<object> work = (object asyncResult) => ExecuteHelper(method, (AsyncResult<T>)asyncResult);
        ThreadPool.QueueUserWorkItem(new WaitCallback(work), ar);
        return ar;
    }
    public static AsyncResult BeginHelper(AsyncCallback callback, object state, Action method)
    {
        // just dummy object
        return BeginHelper<object>(callback, state, () => { method(); return null; });
    }
    public static T EndHelper<T>(IAsyncResult asyncResult)
    {
        AsyncResult<T> ar = (AsyncResult<T>)asyncResult;
        return ar.EndInvoke();
    }
    public static void EndHelper(IAsyncResult asyncResult)
    {
        // just dummy object
        EndHelper<object>(asyncResult);
    }
    private static void ExecuteHelper<T>(Func<T> method, AsyncResult<T> asyncResult)
    {
        try
        {
            T result = method();
            asyncResult.SetAsCompleted(result, false);
        }
        catch (Exception ex)
        {
            asyncResult.SetAsCompleted(ex, false);
        }
    }
}
```

With this wrapper you can call any method in async way very easily.

Still you may notice, that it's expecting only methods without any input params. Although it looks like a problem, you can easily use lambdas to "push" params inside. If you have method `int Foo(string x)` you'll just create `() => Foo("rrr")`.

Feel free to post any problems or feedback here or in [PowerThreading list][4].

[1]: http://www.wintellect.com/PowerThreading.aspx
[2]: http://www.wintellect.com/PowerThreading.aspx
[3]: http://blogs.msdn.com/cbrumme/archive/2003/07/14/51495.aspx
[4]: http://tech.groups.yahoo.com/group/PowerThreading/