---
title: |-
  ConfigureAwaitChecker with support for "await using" and "await foreach"
date: 2021-03-12T12:39:00Z
tags:
  - Roslyn
  - C#
---
It's probably bit overdue, but I finally implemented checking for `ConfigureAwait(false)` in my [_ConfigureAwaitChecker_][5] for `await using` and `await foreach`. Why now? I simply (finally) needed it. So, what's new?

<!-- excerpt -->

It's pretty straightforward. If you have an object implementing `IAsyncDisposable` or `IAsyncEnumerable<T>` and using `await using` or `await foreach` you can/should use `ConfigureAwait(false)` in these, similarly to when using `await` with `Task`, `ValueTask`, ...

![Await using with ConfigureAwaitChecker]({{ include "post_ilink" page "await_using.gif" }})

![Await foreach with ConfigureAwaitChecker]({{ include "post_ilink" page "await_foreach.gif" }})

One remaining piece missing (tracked [here][2]) is properly extracting variable out of `await using` when applying the _code fix_, because the datatype is different after adding `ConfigureAwait(false)` and probably the insides of the `using` block will not work. I originally blogged about it [here][4]. This will be in next update.

Also, with this release I'm releasing the ConfigureAwaitChecker library that the analyzer is using as a NuGet package. In case you'd like to build some awesome stuff on top of it.

Thus, update your [ConfigureAwaitChecker.Analyzer][1] or get [ConfigureAwaitChecker.Lib][3] and enjoy (or report any issues).

> [Related post.][6]

[1]: https://www.nuget.org/packages/ConfigureAwaitChecker.Analyzer
[2]: https://github.com/cincuranet/ConfigureAwaitChecker/issues/28
[3]: https://www.nuget.org/packages/ConfigureAwaitChecker.Lib
[4]: {{ include "post_link" 233779 }}
[5]: https://github.com/cincuranet/ConfigureAwaitChecker
[6]: {{ include "post_link" 233852 }}