---
title: |-
  Empty try with finally
date: 2019-06-10T05:55:00Z
tags:
  - .NET
  - C#
  - .NET Core
---
The `finally` block has a little unknown feature, that frankly isn't even remotely needed for regular day-to-day development, but you already know content on this blog is usually little geeky.

<!-- excerpt -->

The `finally` block is guaranteed to run completely. In other words, it cannot be interrupted using regular outside code (you can still interrupt it yourself). This is important, because there's a little nasty exception named [`ThreadAbortException`][1]. This can erupt basically anywhere anytime. But for some very reliable pieces of code, like synchronization primitives, this isn't what you want to hear.

Related to this are also [_constrained execution regions_][6] or [`CriticalFinalizerObject`][7]. Moreover, .NET Core doesn't support `Thread.Abort` anymore (and JIT is smart [about it][12]).

Putting these two together, this is solvable. And it's nicely visible in i.e. CoreCLR or CoreFX. To find these instances I wrote a small tool using Roslyn. It's basically going through all the files and checking for empty `try` block with non-empty `finally` block. Here's the skeleton of the code.

```csharp
var unit = SyntaxFactory.ParseCompilationUnit(File.ReadAllText(file), options: parseOptions);
foreach (var node in unit.DescendantNodes().Where(n => n.IsKind(SyntaxKind.FinallyClause)))
{
	var finallySyntax = node as FinallyClauseSyntax;
	var trySyntax = finallySyntax.Parent as TryStatementSyntax;
	if (!trySyntax.Block.Statements.Any() && finallySyntax.Block.Statements.Any())
	{
		// bingo
	}
}
```

#### CoreCLR

So, what we can find? In CoreCLR (tests excluded) there's only few instances in `System.Private.CoreLib`.

In [`ProducerConsumerQueues.cs`][2] and [`SemaphoreSlim.cs`][3] it's "regular" stuff to ensure the data structures are not corrupted. In [`ThreadLocal.cs`][4], it's not about data structures per se, but just about making sure the IDs are not leaking aka lost. Finally, the [`Exception.CoreCLR.cs`][5], which I think is most interesting. The comment explains it all.

> Take a lock to ensure only one thread can restore the details
> at a time against this exception object that could have
> multiple ExceptionDispatchInfo instances associated with it.
>
> We do this inside a finally clause to ensure ThreadAbort cannot
> be injected while we have taken the lock. This is to prevent
> unrelated exception restorations from getting blocked due to TAE.

#### CoreFX

In CoreFX I decided to skip `System.Data.OleDb`, `System.Data.Odbc`, `System.Data.SqlClient` and tests, because I'm interested more in low-level pieces. And as you'd expect there's bit more occurrences. Here's the complete list and I'll just focus on few interesting below it.

* [`ConcurrentQueue.cs#L750`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Threading.Tasks.Dataflow/src/Internal/ConcurrentQueue.cs#L750)
* [`ProducerConsumerQueues.cs#L200`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Threading.Tasks.Dataflow/src/Internal/ProducerConsumerQueues.cs#L200)
* [`NetFrameworkUtils.cs#L68`](http://github.com/dotnet/corefx/blob/a1940826/src/Common/src/System/Diagnostics/NetFrameworkUtils.cs#L68)
* [`SharedPerformanceCounter.cs#L535`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Diagnostics.PerformanceCounter/src/System/Diagnostics/SharedPerformanceCounter.cs#L535)
* [`FileSystemWatcher.Linux.cs#L40`](http://github.com/dotnet/corefx/blob/a1940826/src/System.IO.FileSystem.Watcher/src/System/IO/FileSystemWatcher.Linux.cs#L40)
* [`SemaphoreSlim.cs#L351`](http://github.com/dotnet/corefx/blob/a1940826/src/Common/src/CoreLib/System/Threading/SemaphoreSlim.cs#L351)
* [`ThreadLocal.cs#L128`](http://github.com/dotnet/corefx/blob/a1940826/src/Common/src/CoreLib/System/Threading/ThreadLocal.cs#L128)
* [`SingleProducerConsumerQueue.cs#L118`](http://github.com/dotnet/corefx/blob/a1940826/src/Common/src/System/Collections/Concurrent/SingleProducerConsumerQueue.cs#L118)
* [`NamedPipeServerStream.Windows.cs#L232`](http://github.com/dotnet/corefx/blob/a1940826/src/System.IO.Pipes/src/System/IO/Pipes/NamedPipeServerStream.Windows.cs#L232)
* [`MemoryCacheStatistics.cs#L359`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Runtime.Caching/src/System/Runtime/Caching/MemoryCacheStatistics.cs#L359)
* [`Privilege.cs#L200`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Security.AccessControl/src/System/Security/AccessControl/Privilege.cs#L200)
* [`Privilege.cs#L446`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Security.AccessControl/src/System/Security/AccessControl/Privilege.cs#L446)
* [`Privilege.cs#L568`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Security.AccessControl/src/System/Security/AccessControl/Privilege.cs#L568)
* [`NCryptSafeHandles.cs#L245`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Security.Cryptography.Cng/src/Microsoft/Win32/SafeHandles/NCryptSafeHandles.cs#L245)
* [`NCryptSafeHandles.cs#L278`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Security.Cryptography.Cng/src/Microsoft/Win32/SafeHandles/NCryptSafeHandles.cs#L278)
* [`ProducerConsumerQueues.cs#L185`](http://github.com/dotnet/corefx/blob/a1940826/src/Common/src/CoreLib/System/Threading/Tasks/ProducerConsumerQueues.cs#L185)
* [`LdapSessionOptions.cs#L1117`](http://github.com/dotnet/corefx/blob/a1940826/src/System.DirectoryServices.Protocols/src/System/DirectoryServices/Protocols/ldap/LdapSessionOptions.cs#L1117)
* [`LdapSessionOptions.cs#L1132`](http://github.com/dotnet/corefx/blob/a1940826/src/System.DirectoryServices.Protocols/src/System/DirectoryServices/Protocols/ldap/LdapSessionOptions.cs#L1132)
* [`WebSocketBase.cs#L1034`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Net.HttpListener/src/System/Net/Windows/WebSockets/WebSocketBase.cs#L1034)
* [`WebSocketBase.cs#L1118`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Net.HttpListener/src/System/Net/Windows/WebSockets/WebSocketBase.cs#L1118)
* [`MemoryMappedFileBlock.cs#L25`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/MemoryBlocks/MemoryMappedFileBlock.cs#L25)
* [`MemoryMappedFileBlock.cs#L46`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/MemoryBlocks/MemoryMappedFileBlock.cs#L46)
* [`NativeHeapMemoryBlock.cs#L29`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/MemoryBlocks/NativeHeapMemoryBlock.cs#L29)
* [`NativeHeapMemoryBlock.cs#L44`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/MemoryBlocks/NativeHeapMemoryBlock.cs#L44)
* [`PinnedObject.cs#L25`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/Utilities/PinnedObject.cs#L25)
* [`PinnedObject.cs#L41`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/Utilities/PinnedObject.cs#L41)
* [`VirtualHeap.cs#L53`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Metadata/Internal/VirtualHeap.cs#L53)
* [`VirtualHeap.cs#L101`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Metadata/Internal/VirtualHeap.cs#L101)
* [`WindowsRuntimeBuffer.cs#L164`](http://github.com/dotnet/corefx/blob/a1940826/src/System.Runtime.WindowsRuntime/src/System/Runtime/InteropServices/WindowsRuntime/WindowsRuntimeBuffer.cs#L164)

First (ab)use of `finally` that caught my eye is in [`SharedPerformanceCounter.cs`][8], because I don't usually think about shared state across processes. Another interesting is in [`FileSystemWatcher.Linux.cs`][9], talking about the tradeoffs done to make the `FileSystemWatcher` on Linux	 work.

Not exactly usage of `finally` block, but interesting nonetheless is object I found while looking at [`PinnedObject.cs`][10] named [`CriticalDisposableObject.cs`][11] (it's not public). It derives from well known (public) [`CriticalFinalizerObject`][7] and provides a simple template. The `Release` method reminds me all of the different ways that were used decade or more ago for "disposing" - `Release`, `Dispose`, `Close`, `Free`, etc. methods, some of them still in place today (yes, I'm looking at you `Stream` class).

#### Closing

It's always nice to read other - preferably smarter - people's code. And that's what this was all about, with a small focus on specific shape of code to maybe discover something thought-provoking.

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.threadabortexception?view=netcore-3.0
[2]: https://github.com/dotnet/coreclr/blob/ac70d9bb/src/System.Private.CoreLib/shared/System/Threading/Tasks/ProducerConsumerQueues.cs#L185
[3]: https://github.com/dotnet/coreclr/blob/ac70d9bb/src/System.Private.CoreLib/shared/System/Threading/SemaphoreSlim.cs#L351
[4]: https://github.com/dotnet/coreclr/blob/ac70d9bb/src/System.Private.CoreLib/shared/System/Threading/ThreadLocal.cs#L128
[5]: https://github.com/dotnet/coreclr/blob/ac70d9bb/src/System.Private.CoreLib/src/System/Exception.CoreCLR.cs#L313
[6]: https://docs.microsoft.com/en-us/dotnet/framework/performance/constrained-execution-regions
[7]: https://docs.microsoft.com/en-us/dotnet/api/system.runtime.constrainedexecution.criticalfinalizerobject?view=netcore-3.0
[8]: https://github.com/dotnet/corefx/blob/a1940826/src/System.Diagnostics.PerformanceCounter/src/System/Diagnostics/SharedPerformanceCounter.cs#L535
[9]: https://github.com/dotnet/corefx/blob/a1940826/src/System.IO.FileSystem.Watcher/src/System/IO/FileSystemWatcher.Linux.cs#L40
[10]: https://github.com/dotnet/corefx/blob/a1940826/src/System.Reflection.Metadata/src/System/Reflection/Internal/Utilities/PinnedObject.cs
[11]: https://github.com/dotnet/corefx/blob/master/src/System.Reflection.Metadata/src/System/Reflection/Internal/Utilities/CriticalDisposableObject.cs
[12]: https://github.com/dotnet/coreclr/pull/8949