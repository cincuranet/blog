---
title: |-
  How does asynchronous Main work under the hood?
date: 2017-10-31T07:42:00Z
tags:
  - C#
  - .NET
  - .NET Core
  - Roslyn
---
[C# 7.1][5] comes with option to use [asynchronous `Main` method][1]. That means now the `Main` can have `async` modifier and return `Task` or `Task<int>`. But how it works under the hood? Let's find out.

<!-- excerpt -->

Given this feature is available from C# 7.1 it's clearly just compiler feature not relying on anything from say CLR. Thus the compiler is doing "just" some transformation.

#### History

Before C# 7.1 if you wanted to have asynchronous `Main`, you has basically two options.

The straightforward using [`Wait`][2].

```csharp
static void Main(string[] args)
{
    MainAsync().Wait();
}
```

Or, if you knew little bit of inner workings, using [`GetAwaiter`][3] and [`GetResult`][4].

```csharp
static void Main(string[] args)
{
    MainAsync().GetAwaiter().GetResult();
}
```

These two approaches are not exactly the same, in particular concerning exceptions, but both get the job done. Is compiler doing something else? Something smarter?

#### C# 7.1 version

I created an empty console application, with empty `static async Task Main(string[] args)` and added `<LangVersion>7.1</LangVersion>` to the `csproj`. Opened good old [`ildasm`][6] and here's the result.

```text
.method private hidebysig specialname static
        void  '<Main>'(string[] args) cil managed
{
  .entrypoint
  // Code size       20 (0x14)
  .maxstack  1
  .locals init (valuetype [System.Runtime]System.Runtime.CompilerServices.TaskAwaiter V_0)
  IL_0000:  ldarg.0
  IL_0001:  call       class [System.Runtime]System.Threading.Tasks.Task ConsoleApp1.Program::Main(string[])
  IL_0006:  callvirt   instance valuetype [System.Runtime]System.Runtime.CompilerServices.TaskAwaiter [System.Runtime]System.Threading.Tasks.Task::GetAwaiter()
  IL_000b:  stloc.0
  IL_000c:  ldloca.s   V_0
  IL_000e:  call       instance void [System.Runtime]System.Runtime.CompilerServices.TaskAwaiter::GetResult()
  IL_0013:  ret
} // end of method Program::'<Main>'
```

It generated new `<Main>(string[] args)` method and the body is simple `Program.Main(args).GetAwaiter().GetResult();`. If the `Main` returns `int`, then the method is basically the same, only having explicit return of value from `GetResult`.

#### Conclusion

There you have it. Nothing special and absolutely straightforward. So even if you can't use C# 7.1, you can write this yourself without any real effort.

> [Related post.][7]

[1]: https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-7-1#async-main
[2]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.wait?view=netframework-4.7.1#System_Threading_Tasks_Task_Wait
[3]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.getawaiter?view=netframework-4.7.1#System_Threading_Tasks_Task_GetAwaiter
[4]: https://docs.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.taskawaiter.getresult?view=netframework-4.7.1#System_Runtime_CompilerServices_TaskAwaiter_GetResult
[5]: https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-7-1
[6]: https://docs.microsoft.com/en-us/dotnet/framework/tools/ildasm-exe-il-disassembler
[7]: {{ include "post_link" 233908 }}
