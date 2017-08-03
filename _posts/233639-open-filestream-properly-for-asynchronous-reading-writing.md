---
title: |-
  Open FileStream properly for asynchronous reading/writing 
date: 2017-08-03T15:30:00Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Asynchronous stuff with `async`/`await` in C# is great. But as with any other great tool, there are some gotchas that might cost you something (performance, memory, etc.). Today I'm going to talk about `FileStream`.

<!-- excerpt -->

With .NET 4.5 the [`FileStream`][1] has also the `XxxAsync` methods. Thus, one might expect when using these that everything works as good as it could be. Well, not exactly. From outside perspective, it will probably work just fine - the calling thread is not blocked. But it's not as good as it could be.

On Windows, when you want to open/create a `HANDLE` (which the file ultimately is) and use [_overlapped_ operations][2] (which is just a different name for asynchronous operations in Windows operating system), you need to specify "asynchronous" flag. On `FileStream` that's the [`FileOptions.Asynchronous`][3] (or the `isAsync` `bool` parameter) in constructor. As you can guess, this does matter for `await`.

Let's take a look at `ReadAsync` for example. The method will end up [here][4]. In case the flag was not present it will "fallback" to `base.ReadAsync`, which in turn [will eventually call][5] regular `Read` in `Task` (and hence on thread pool thread). In case the `FileOptions.Asynchronous` was present the _overlapped_ operations will be used. In the `ReadAsync`'s case [here][6] via [this][7]. And the real _overlapped_ operations are a different ball game. System handles that. Way more efficient.

Hence next time, if you're looking for every possible performance improvement, don't forget to specify `FileOptions.Asynchronous`.

[1]: https://msdn.microsoft.com/en-us/library/system.io.filestream(v=vs.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/windows/desktop/ms686358(v=vs.85).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.io.fileoptions(v=vs.110).aspx
[4]: https://referencesource.microsoft.com/#mscorlib/system/io/filestream.cs,2630
[5]: https://referencesource.microsoft.com/#mscorlib/system/io/stream.cs,347
[6]: https://referencesource.microsoft.com/#mscorlib/system/io/filestream.cs,2511
[7]: https://referencesource.microsoft.com/#mscorlib/system/io/filestream.cs,2066