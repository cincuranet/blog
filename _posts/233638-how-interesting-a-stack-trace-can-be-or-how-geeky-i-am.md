---
title: |-
  How interesting a stack trace can be, or how geeky I am? 
date: 2017-07-27T10:54:00Z
tags:
  - C#
  - C++/CLI
  - .NET
---
I was profiling _FbNetExternalEngine_ to squeeze a bit more performance from the code and as I was going through stack traces, hot paths and allocations, I realized (again), how geeky I am. I was looking into a stack trace and found it fascinating.

<!-- excerpt -->

Here's an example of such stack trace.

```text
Example!Example.Procedures.IncrementInteger(int? i) Line 9	C#
FbNetExternalEngineManaged.dll!FbNetExternalEngineManaged.Interop.ResultSet.Fetch() Line 28	C#
FbNetExternalEnginePlugin.DLL!FbNetExternalEnginePlugin::ResultSet::fetch(Firebird::ThrowStatusWrapper* status) Line 24	C++
FbNetExternalEnginePlugin.DLL!Firebird::IExternalResultSetBaseImpl<FbNetExternalEnginePlugin::ResultSet,Firebird::ThrowStatusWrapper,Firebird::IDisposableImpl<FbNetExternalEnginePlugin::ResultSet,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IVersionedImpl<FbNetExternalEnginePlugin::ResultSet,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IExternalResultSet> > > > >::cloopfetchDispatcher(Firebird::IExternalResultSet* self, Firebird::IStatus* status) Line 11666	C++
[Native to Managed Transition]	
engine12.dll!00007ff956b88972()	Unknown
engine12.dll!00007ff956b8fa42()	Unknown
engine12.dll!00007ff956b61ea6()	Unknown
engine12.dll!00007ff956b62182()	Unknown
engine12.dll!00007ff956b62383()	Unknown
engine12.dll!00007ff956b62bd5()	Unknown
engine12.dll!00007ff956af451b()	Unknown
engine12.dll!00007ff956af4aaf()	Unknown
engine12.dll!00007ff956b61ea6()	Unknown
engine12.dll!00007ff956b62182()	Unknown
engine12.dll!00007ff956b62383()	Unknown
engine12.dll!00007ff956b627e2()	Unknown
engine12.dll!00007ff956bb0f92()	Unknown
engine12.dll!00007ff956a4f7af()	Unknown
engine12.dll!00007ff956a435b2()	Unknown
engine12.dll!00007ff956bd311a()	Unknown
engine12.dll!00007ff956bd3e26()	Unknown
fbclient.dll!00007ff96274c462()	Unknown
fbclient.dll!00007ff9627383ba()	Unknown
fbclient.dll!00007ff96274971f()	Unknown
[Managed to Native Transition]	
FB_1224668872.dll!<Unknown function>	Unknown
FirebirdSql.Data.FirebirdClient.dll!FirebirdSql.Data.Client.Native.FesStatement.Execute() Line 328	C#
FirebirdSql.Data.FirebirdClient.dll!FirebirdSql.Data.FirebirdClient.FbCommand.ExecuteCommand(System.Data.CommandBehavior behavior, bool returnsSet) Line 1202	C#
FirebirdSql.Data.FirebirdClient.dll!FirebirdSql.Data.FirebirdClient.FbCommand.ExecuteCommand(System.Data.CommandBehavior behavior) Line 1164	C#
FirebirdSql.Data.FirebirdClient.dll!FirebirdSql.Data.FirebirdClient.FbCommand.ExecuteNonQuery() Line 467	C#
Tests.exe!Tests.Integration.ProcedureTests.ExecutableProcedureTest(string procedure, object[] inputs, object[] outputs) Line 140	C#
[Native to Managed Transition]	
[Managed to Native Transition]	
nunit.framework.dll!NUnit.Framework.Internal.Reflect.InvokeMethod(System.Reflection.MethodInfo method, object fixture, object[] args)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.MethodWrapper.Invoke(object fixture, object[] args)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Commands.TestMethodCommand.RunNonAsyncTestMethod(NUnit.Framework.Internal.TestExecutionContext context)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Commands.TestMethodCommand.RunTestMethod(NUnit.Framework.Internal.TestExecutionContext context)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Commands.TestMethodCommand.Execute(NUnit.Framework.Internal.TestExecutionContext context)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Commands.TestActionCommand.Execute(NUnit.Framework.Internal.TestExecutionContext context)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Commands.SetUpTearDownCommand.Execute(NUnit.Framework.Internal.TestExecutionContext context)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.SimpleWorkItem.PerformWork()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.RunTest()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.Execute()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.ParallelWorkItemDispatcher.Execute(NUnit.Framework.Internal.Execution.WorkItem work)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.ParallelWorkItemDispatcher.Dispatch(NUnit.Framework.Internal.Execution.WorkItem work)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.CompositeWorkItem.RunChildren()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.CompositeWorkItem.PerformWork()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.RunTest()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.Execute()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.ParallelWorkItemDispatcher.Execute(NUnit.Framework.Internal.Execution.WorkItem work)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.ParallelWorkItemDispatcher.Dispatch(NUnit.Framework.Internal.Execution.WorkItem work)	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.CompositeWorkItem.RunChildren()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.CompositeWorkItem.PerformWork()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.RunTest()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.WorkItem.Execute()	Unknown
nunit.framework.dll!NUnit.Framework.Internal.Execution.TestWorker.TestWorkerThreadProc()	Unknown
mscorlib.dll!System.Threading.ExecutionContext.RunInternal(System.Threading.ExecutionContext executionContext, System.Threading.ContextCallback callback, object state, bool preserveSyncCtx)	Unknown
mscorlib.dll!System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext executionContext, System.Threading.ContextCallback callback, object state, bool preserveSyncCtx)	Unknown
mscorlib.dll!System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext executionContext, System.Threading.ContextCallback callback, object state)	Unknown
mscorlib.dll!System.Threading.ThreadHelper.ThreadStart()	Unknown
[Native to Managed Transition]	
kernel32.dll!00007ff9aaa52774()	Unknown
ntdll.dll!00007ff9ab6a0d51()	Unknown
```

It is a console application using [NUnit Lite][1] to execute tests. It uses [Firebird Embedded][2] where _FbNetExternalEngine_ plugin is loaded and executing custom stored procedure written in C#. 

Looking deeper under the covers is where I started smiling inside (and maybe even outside). So there's a managed console application with NUnit (I'm ignoring the loading of .NET/CLR). That's in turn running code that uses [FirebirdClient][3] and loads Firebird Embedded. It's done by generating dynamic assembly in memory where all the `DllImport` attributes are. Once the code jumps out of this code, it goes into native code in `fbembed.dll`/`fbclient.dll`. That in turn goes into `engine12.dll` (in case of Firebird 3), which, as you can guess, is the main Firebird engine. Engine loads my plugin library (`FbNetExternalEnginePlugin.dll`), which is still native code (partially, it's [C++/CLI][4]). My plugin then goes to managed code via `FbNextExternalEngineManaged.dll`. Yep, it's back in managed code. Finally, the actual procedure implementation is in `Example.dll` (managed) where the stack trace originates. Or in short: NUnit (managed) → FirebirdClient (managed) → generated assembly (managed) → Firebird Embedded (native) → `fbclient.dll` (native) → `engine12.dll` (native) → `FbNetExternalEnginePlugin.dll` (native) → `FbNetExternalEngineManaged.dll` (managed) → `Example.dll` (managed). 

Fascinating (the code, not my geekiness), isn't it? All these imaginary cogwheels eventually turning and doing something.

> [Related post.][5]

[1]: https://github.com/nunit/docs/wiki/NUnitLite-Runner
[2]: https://www.firebirdsql.org/pdfmanual/html/ufb-cs-embedded.html
[3]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient
[4]: https://msdn.microsoft.com/en-us/library/68td296t.aspx
[5]: {% include post_link, id: "233628" %}