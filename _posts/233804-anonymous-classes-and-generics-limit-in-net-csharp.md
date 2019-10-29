---
title: |-
  Anonymous classes and generics limit in .NET/C#?
date: 2019-10-14T06:50:00Z
tags:
  - .NET
  - .NET Core
  - C#
---
Have you ever looked how anonymous classes are implemented? If you did, you know it's a generated generic class. And if you didn't, you know now. Either way, you can find more details below. But also building on top of [previous post about generic parameters limit in generic classes][1], where's the limit here? It surely cannot be higher.

<!-- excerpt -->

#### Background

If you create an anonymous class, the compiler creates class for you and it's a generic class where each field is typed using the generic parameter. Take for example this code.

```csharp
static object Test()
{
	return new
	{
		Field1 = 10,
		Field2 = 20,
		Field3 = 30,
	};
}
```

The compiler generates something like this for you (`Equals`, `GetHashCode` and `ToString` omitted).

```csharp
[CompilerGenerated]
internal sealed class <>f__AnonymousType0<<Field1>j__TPar, <Field2>j__TPar, <Field3>j__TPar>
{
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private readonly <Field1>j__TPar <Field1>i__Field;

	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private readonly <Field2>j__TPar <Field2>i__Field;

	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private readonly <Field3>j__TPar <Field3>i__Field;

	public <Field1>j__TPar Field1 => <Field1>i__Field;

	public <Field2>j__TPar Field2 => <Field2>i__Field;

	public <Field3>j__TPar Field3 => <Field3>i__Field;

	[DebuggerHidden]
	public <>f__AnonymousType0(<Field1>j__TPar Field1, <Field2>j__TPar Field2, <Field3>j__TPar Field3)
	{
		<Field1>i__Field = Field1;
		<Field2>i__Field = Field2;
		<Field3>i__Field = Field3;
	}
}
```

The `<Field1>j__TPar`, `<Field2>j__TPar` and `<Field3>j__TPar` are the generic parameters. Thus, the limits mentioned in [previous post][1] apply here, granted it's under the cover.

A small interesting fact. If you create anonymous class with the same field names, the generated class will be reused and the types don't matter thanks to the power of generics. I.e. the code below reuses the above generated class.

```csharp
static object Test2()
{
	return new
	{
		Field1 = "",
		Field2 = 20,
		Field3 = 30,
	};
}
```

But not this one.

```csharp
static object Test3()
{
	return new
	{
		Field1 = "",
		Field2 = 20,
		Field33 = 30,
	};
}
```

#### Limit

Compared to [previous post][1], it's purely about compiler. If you could somehow generate the code or assembly, well, you would generate exactly what would be needed. Right? With that, let's dive directly into it. [Here][2] is a piece of code that returns an anonymous class with 65535 fields. That should be right on the edge. But trying to compile that file with `csc.exe` version `3.300.119.46102` aka .NET Core 3.0 fails with error `CS8078: An expression is too long or complex to compile` (after significant amount of time). That's not much information to work with. Luckily [looking into `ErrorCode.cs`][3] shows that the "name" for this error code is `ERR_InsufficientStack`. Probably something in Roslyn is using recursion and this goes too deep. Bummer. Let's try "only" 4000 fields (4000 for no particular reason). OK, that works. And in fact, it's quite fast. What now?

Let's take a reasonable approach. Although you can create a code with anonymous class that fails to compile, it's beyond what one would write. Fair, isn't it? Also, it's important to understand that the limit is very fragile, because even a small change in Roslyn's code can change how stack space is consumed (both negatively and positively) and hence at what point it will stop working. You don't want to hover around it.

Now let's take unreasonable approach. Can I push it somehow? And the answer is, I can. Unless Roslyn sets the stack size explicitly, I can change the default stack size in PE header and hope for the best. In the spirit of _balls to the wall_ I used `editbin /stack` and set the stack to 400MB (in case you'd like to run it yourself, [here is the binary][4]). For the record, 1MB is default stack size on Windows. Cue the dramatic music... Nope. Although indeed Roslyn uses default stack sizes, thus the bigger stack was active, it failed at different point later and even harder via `FailFast`.

```text
Message: System.InvalidOperationException: Sequence contains no elements
   at System.Linq.Enumerable.First[TSource](IEnumerable`1 source)
   at System.Linq.ImmutableArrayExtensions.First[T](ImmutableArray`1 immutableArray)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.GenerateMethodBody(PEModuleBuilder moduleBuilder, MethodSymbol method, Int32 methodOrdinal, BoundStatement block, ImmutableArray`1 lambdaDebugInfo, ImmutableArray`1 closureDebugInfo, StateMachineTypeSymbol stateMachineTypeOpt, VariableSlotAllocator variableSlotAllocatorOpt, DiagnosticBag diagnostics, DebugDocumentProvider debugDocumentProvider, ImportChain importChainOpt, Boolean emittingPdb, Boolean emitTestCoverageData, ImmutableArray`1 dynamicAnalysisSpans, AsyncForwardEntryPoint entryPointOpt)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.CompileSynthesizedMethods(TypeCompilationState compilationState)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.CompileNamedType(NamedTypeSymbol containingType)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.<>c__DisplayClass22_0.<CompileNamedTypeAsTask>b__0()
Stack:
   at System.Environment.FailFast(System.String, System.Exception)
   at Microsoft.CodeAnalysis.FatalError.ReportUnlessCanceled(System.Exception)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler+<>c__DisplayClass22_0.<CompileNamedTypeAsTask>b__0()
   at System.Linq.Enumerable.First[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](System.Collections.Generic.IEnumerable`1<System.__Canon>)
   at System.Linq.ImmutableArrayExtensions.First[[System.__Canon, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]](System.Collections.Immutable.ImmutableArray`1<System.__Canon>)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.GenerateMethodBody(Microsoft.CodeAnalysis.CSharp.Emit.PEModuleBuilder, Microsoft.CodeAnalysis.CSharp.Symbols.MethodSymbol, Int32, Microsoft.CodeAnalysis.CSharp.BoundStatement, System.Collections.Immutable.ImmutableArray`1<Microsoft.CodeAnalysis.CodeGen.LambdaDebugInfo>, System.Collections.Immutable.ImmutableArray`1<Microsoft.CodeAnalysis.CodeGen.ClosureDebugInfo>, Microsoft.CodeAnalysis.CSharp.StateMachineTypeSymbol, Microsoft.CodeAnalysis.CodeGen.VariableSlotAllocator, Microsoft.CodeAnalysis.DiagnosticBag, Microsoft.CodeAnalysis.CodeGen.DebugDocumentProvider, Microsoft.CodeAnalysis.CSharp.ImportChain, Boolean, Boolean, System.Collections.Immutable.ImmutableArray`1<Microsoft.CodeAnalysis.CodeGen.SourceSpan>, AsyncForwardEntryPoint)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.CompileSynthesizedMethods(Microsoft.CodeAnalysis.CSharp.TypeCompilationState)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler.CompileNamedType(Microsoft.CodeAnalysis.CSharp.Symbols.NamedTypeSymbol)
   at Microsoft.CodeAnalysis.CSharp.MethodCompiler+<>c__DisplayClass22_0.<CompileNamedTypeAsTask>b__0()
   at Roslyn.Utilities.UICultureUtilities+<>c__DisplayClass5_0.<WithCurrentUICulture>b__0()
   at System.Threading.Tasks.Task.Execute()
   at System.Threading.ExecutionContext.RunInternal(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
   at System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(System.Threading.Tasks.Task ByRef)
   at System.Threading.Tasks.Task.ExecuteEntry(Boolean)
   at System.Threading.ThreadPoolWorkQueue.Dispatch()
```

At this time, instead of wasting time (I could instead do some PRs on Roslyn optimizing the stack consumption, right? ;)), I decided to try where it fails in this setup. Surprisingly it failed right after nice "computer-ish" number of 32767 fields. Result! If you'd like to explore the resulting assembly, [here it is][5].

#### Closing

What we can take from this exercise? First, don't write crazy shit. Compilers, although written by smart people, play on the same field as all of us. Then, unbounded recursion might kill your application (sometimes [tail-call optimization][6] can save you), because stack is limited. Think about edge cases and when or if these will be hit.

[1]: {% include post_link, id: "233802" %}
[2]: {% include post_ilink, post: page, name: "AnonymousClass.cs" %}
[3]: https://github.com/dotnet/roslyn/blob/41548da4df58e5cab883111567160a70827a01cf/src/Compilers/CSharp/Portable/Errors/ErrorCode.cs#L1311
[4]: {% include post_ilink, post: page, name: "csc.exe" %}
[5]: {% include post_ilink, post: page, name: "32767.7z" %}
[6]: https://en.wikipedia.org/wiki/Tail_call