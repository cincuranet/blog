---
title: "Waiting for process to exit without blocking"
date: 2015-10-15T07:31:00Z
tags:
  - C#
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233533/
layout: post
---
I have been scripting something in build process of one big project where to make the final binaries bunch of other tools need to be executed. Given that this was in pipeline where most of steps were asynchronous I was eager to have this non-blocking as well and possibly introduce parallelism.

<!-- excerpt -->

The problem is that the [`Process` class][1] has only `WaitForExit` method, blocking. Luckily there's a `OnExited` event. Using it I can construct [`TaskCompletionSource`][2] and signal it completed when the process exits. Here's the extension ready to be used.

```csharp
public static Task WaitForExitAsync(this Process p)
{
  p.EnableRaisingEvents = true;
  var tcs = new TaskCompletionSource<object>();
  p.Exited += (s, e) => tcs.TrySetResult(null);
  if (p.HasExited)
    tcs.TrySetResult(null);
  return tcs.Task;
}
```

You can plug timeouts or [`CancelationToken`][3]s if you you need those. It will make the code bit less straightforward, though.

[1]: https://msdn.microsoft.com/en-us/library/system.diagnostics.process(v=vs.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/dd449174(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.threading.cancellationtoken(v=vs.110).aspx