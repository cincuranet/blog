---
title: |-
  Geeking with .NET application and Firebird Embedded and FbNetExternalEngine
date: 2022-12-08T08:17:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
I was having one of those ideas that is useless at that given moment in time but might become the secret weapon in the future. This time it's about application, Firebird Embedded and _FbNetExternalEngine_.

<!-- excerpt -->

#### Starting

The idea is simple. An application that uses Firebird Embedded and inside the same application are all the functions and procedures for _FbNetExternalEngine_ (instead of having dedicated assembly). Don't get me wrong, there's nothing wrong with having separate assembly (especially if we're talking about typical _server_ deployment), but with Firebird Embedded there's certain beauty in not having extra file (Using single file would be even nicer (and more elaborate), but I'll leave that for another time.).

Surprisingly (little) everything worked on a first try. Here's the code.

```csharp
using FbNetExternalEngineIntegration.ExecutionContext;
using FirebirdSql.Data.FirebirdClient;

namespace Inception;

class Program
{
    static void Main()
    {
        var csb = new FbConnectionStringBuilder();
        csb.ServerType = FbServerType.Embedded;
        csb.ClientLibrary = @"Firebird\fbclient.dll";
        csb.Database = "inception.fdb";
        csb.UserID = "sysdba";
        csb.Password = "masterkey";
        var cs = csb.ToString();
        FbConnection.CreateDatabase(cs, overwrite: true);
        using (var conn = new FbConnection(cs))
        {
            conn.Open();
            var file = Environment.ProcessPath[..^4];
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = $"create function inception() returns blob sub_type text external name '{file}!Inception.Inception.DoIt' engine FbNetExternalEngine";
                cmd.ExecuteNonQuery();
                cmd.CommandText = $"create function real_inception() returns blob sub_type text external name '{file}!Inception.Inception.ReallyDoIt' engine FbNetExternalEngine";
                cmd.ExecuteNonQuery();
            }
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = $"select inception() from rdb$database";
                Console.WriteLine(cmd.ExecuteScalar());
            }
        }
    }
}

public static class Inception
{
    public static string DoIt(IExecutionContext context)
    {
        return context.Execute<string>("select real_inception() from rdb$database").First().Item1;
    }

    public static string ReallyDoIt() => Environment.StackTrace;
}
```

The reason I did the weird looking split with `DoIt` and `ReallyDoIt` is to use `IExecutionContext` and have more interesting stack trace.

Speaking of stack trace, this is the output of the application.

```text
   at System.Environment.get_StackTrace()
   at Inception.Inception.ReallyDoIt() in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 45
   at FbNetExternalEngineManaged.Method.MethodFinderResult`1.Invoke(Arguments inputs, IStatementExecutor statementExecutor)
   at FbNetExternalEngineManaged.Execution.InvokerBase`2.Invoke(Void* inMsg, Void* outMsg, IBlobHandler blobHandler, IStatementExecutor statementExecutor)
   at FbNetExternalEnginePlugin.Function.execute(Function* , ThrowStatusWrapper* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IExternalFunctionBaseImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::IDisposableImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IVersionedImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IExternalFunction> > > > >.cloopexecuteDispatcher(IExternalFunction* self, IStatus* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IResultSet.fetchNext<class Firebird::ThrowStatusWrapper>(IResultSet* , ThrowStatusWrapper* status, Void* message)
   at FbNetExternalEnginePlugin.StatementExecutor.FetchNext()
   at FbNetExternalEngineManaged.Integration.ExecutionContext.ExecuteImpl(String statement)+MoveNext()
   at FbNetExternalEngineManaged.Integration.ExecutionContext.Execute[T1](String command)+MoveNext()
   at System.Linq.Enumerable.TryGetFirst[TSource](IEnumerable`1 source, Boolean& found)
   at System.Linq.Enumerable.First[TSource](IEnumerable`1 source)
   at Inception.Inception.DoIt(IExecutionContext context) in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 42
   at FbNetExternalEngineManaged.Method.MethodFinderResult`1.Invoke(Arguments inputs, IStatementExecutor statementExecutor)
   at FbNetExternalEngineManaged.Execution.InvokerBase`2.Invoke(Void* inMsg, Void* outMsg, IBlobHandler blobHandler, IStatementExecutor statementExecutor)
   at FbNetExternalEnginePlugin.Function.execute(Function* , ThrowStatusWrapper* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IExternalFunctionBaseImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::IDisposableImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IVersionedImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IExternalFunction> > > > >.cloopexecuteDispatcher(IExternalFunction* self, IStatus* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at FB_1022125550_Class.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
   at FB_1022125550_Class.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
   at FB_1022125550_Class.IFbClient.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
   at FirebirdSql.Data.Client.Native.FesStatement.Fetch()
   at FirebirdSql.Data.FirebirdClient.FbCommand.ExecuteScalar()
   at Inception.Program.Main() in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 32
```

#### Geeking

And if you are long time reader of my blog, you know I like geeking out ([here][1] and [here][2]) about how everything nicely fits together between CLR and native code.

Let's split it into pieces.

```text
   at FirebirdSql.Data.Client.Native.FesStatement.Fetch()
   at FirebirdSql.Data.FirebirdClient.FbCommand.ExecuteScalar()
   at Inception.Program.Main() in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 32
```

This is regular C# code in application and _FirebirdClient_. Not much interesting.

```
   at FB_1022125550_Class.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
   at FB_1022125550_Class.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
   at FB_1022125550_Class.IFbClient.isc_dsql_fetch(IntPtr[] statusVector, StatementHandle& stmtHandle, Int16 daVersion, IntPtr xsqlda)
```

This is P/Invoke code generated by _FirebirdClient_ to dynamically load Firebird Embedded and execute SQL.

```text
   at FbNetExternalEnginePlugin.Function.execute(Function* , ThrowStatusWrapper* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IExternalFunctionBaseImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::IDisposableImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IVersionedImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IExternalFunction> > > > >.cloopexecuteDispatcher(IExternalFunction* self, IStatus* status, IExternalContext* context, Void* inMsg, Void* outMsg)
```

This is native code of Firebird that handles the execution and eventually executes the so-called external function.

```text
   at FbNetExternalEngineManaged.Integration.ExecutionContext.ExecuteImpl(String statement)+MoveNext()
   at FbNetExternalEngineManaged.Integration.ExecutionContext.Execute[T1](String command)+MoveNext()
   at System.Linq.Enumerable.TryGetFirst[TSource](IEnumerable`1 source, Boolean& found)
   at System.Linq.Enumerable.First[TSource](IEnumerable`1 source)
   at Inception.Inception.DoIt(IExecutionContext context) in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 42
   at FbNetExternalEngineManaged.Method.MethodFinderResult`1.Invoke(Arguments inputs, IStatementExecutor statementExecutor)
   at FbNetExternalEngineManaged.Execution.InvokerBase`2.Invoke(Void* inMsg, Void* outMsg, IBlobHandler blobHandler, IStatementExecutor statementExecutor)
```

This is part when we're back in our application in `DoIt` (with some .NET and FbNetExternalEngineManaged boilerplate to get there), the very same that has the `Main` method.

```text
   at System.Environment.get_StackTrace()
   at Inception.Inception.ReallyDoIt() in C:\Users\Jiri\source\repos\Inception\Inception\Program.cs:line 45
   at FbNetExternalEngineManaged.Method.MethodFinderResult`1.Invoke(Arguments inputs, IStatementExecutor statementExecutor)
   at FbNetExternalEngineManaged.Execution.InvokerBase`2.Invoke(Void* inMsg, Void* outMsg, IBlobHandler blobHandler, IStatementExecutor statementExecutor)
   at FbNetExternalEnginePlugin.Function.execute(Function* , ThrowStatusWrapper* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IExternalFunctionBaseImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::IDisposableImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IVersionedImpl<FbNetExternalEnginePlugin::Function,Firebird::ThrowStatusWrapper,Firebird::Inherit<Firebird::IExternalFunction> > > > >.cloopexecuteDispatcher(IExternalFunction* self, IStatus* status, IExternalContext* context, Void* inMsg, Void* outMsg)
   at Firebird.IResultSet.fetchNext<class Firebird::ThrowStatusWrapper>(IResultSet* , ThrowStatusWrapper* status, Void* message)
   at FbNetExternalEnginePlugin.StatementExecutor.FetchNext()
```

Now we're getting back to Firebird and executing SQL there (internally, in the same transaction(!), not via ADO.NET), then back to plugin and back to our application into `ReallyDoIt`.

#### Closing

Every time I do something like this, I'm always smiling how all the pieces nicely fit together. And also, I can't stop thinking about the huge power one gets when SQL joins forces with .NET. Yes, I'm a geek. And I'm not ashamed.

[1]: {{ include "post_link" 233638 }}
[2]: {{ include "post_link" 233628 }}
