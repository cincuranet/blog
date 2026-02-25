---
title: |-
  What is the cost of casting in .NET (C#)?
date: 2022-02-08T19:42:00Z
tags:
  - C#
  - .NET
  - Performance
---
As I was (at that moment) running out of ideas about optimizations in hot paths in [_FbNetExternalEngine_][1], I turned my attention into other parts of code. And one piece that was doing casting on every call caught my attention. Could I make the casting faster? What is actually the cost of casting? Does it matter? I had to dive into it.

<!-- excerpt -->

#### Setup

The setup of this benchmark was pretty straightforward. In my case the casting was from `object` to `ITuple`. Your mileage may vary.

```text
BenchmarkDotNet=v0.13.1, OS=Windows 10.0.19043.1466 (21H1/May2021Update)
AMD Ryzen 7 5800X, 1 CPU, 16 logical and 8 physical cores
.NET SDK=6.0.101
  [Host]     : .NET 6.0.1 (6.0.121.56705), X64 RyuJIT
  DefaultJob : .NET 6.0.1 (6.0.121.56705), X64 RyuJIT
```

#### Method argument

First, I tried casting the argument of a method.

```csharp
public ITuple UnsafeCastArgument(object o)
{
	return Unsafe.As<ITuple>(o);
}
public ITuple RegularCastArgument(object o)
{
	return (ITuple)o;
}
```

|              Method |                    o |      Mean |     Error |    StdDev | Ratio | Code Size |
|-------------------- |--------------------- |----------:|----------:|----------:|------:|----------:|
|  UnsafeCastArgument |                    ? | 0.0002 ns | 0.0003 ns | 0.0003 ns | 0.000 |       4 B |
| RegularCastArgument |                    ? | 1.0396 ns | 0.0044 ns | 0.0036 ns | 1.000 |      25 B |
|  UnsafeCastArgument |                 (10) | 0.0003 ns | 0.0005 ns | 0.0005 ns | 0.000 |       4 B |
| RegularCastArgument |                 (10) | 2.1023 ns | 0.0044 ns | 0.0041 ns | 1.000 |      25 B |
|  UnsafeCastArgument |             (10, 20) | 0.0001 ns | 0.0002 ns | 0.0002 ns | 0.000 |       4 B |
| RegularCastArgument |             (10, 20) | 2.1028 ns | 0.0056 ns | 0.0049 ns | 1.000 |      25 B |
|  UnsafeCastArgument | (10, (...)8, 9) [38] | 0.0002 ns | 0.0005 ns | 0.0005 ns | 0.000 |       4 B |
| RegularCastArgument | (10, (...)8, 9) [38] | 2.3068 ns | 0.0033 ns | 0.0027 ns | 1.000 |      25 B |

The `?` denotes `null`, rest is regular `ValueTuple`s of various sizes.

The _unsafe_ casting is, as expected, a clear winner. Looking at the disassembly makes it obvious.

```asm
mov       rax,rdx    
ret                  
```

Could this be any smoother? :) 

The _safe_ variant looks like this.

```asm
sub       rsp,28
mov       rcx,offset MT_System.Runtime.CompilerServices.ITuple
call      CORINFO_HELP_CHKCASTINTERFACE
nop
add       rsp,28
ret
```

If you'd like to check implementation of `CORINFO_HELP_CHKCASTINTERFACE`, you can start [here][2].

#### Property

For the completeness-sake I also tested how the code behaves when casting property.

```csharp
public object O { get; set; }

public ITuple UnsafeCastProperty()
{
	return Unsafe.As<ITuple>(O);
}
public ITuple RegularCastProperty()
{
	return (ITuple)O;
}
```

|              Method |                    O |      Mean |     Error |    StdDev | Ratio | Code Size |
|-------------------- |--------------------- |----------:|----------:|----------:|------:|----------:|
|  UnsafeCastProperty |                    ? | 0.0009 ns | 0.0008 ns | 0.0007 ns | 0.001 |       5 B |
| RegularCastProperty |                    ? | 1.2440 ns | 0.0017 ns | 0.0014 ns | 1.000 |      29 B |
|  UnsafeCastProperty |                 (10) | 0.0007 ns | 0.0008 ns | 0.0007 ns | 0.000 |       5 B |
| RegularCastProperty |                 (10) | 2.3092 ns | 0.0036 ns | 0.0030 ns | 1.000 |      29 B |
|  UnsafeCastProperty |             (10, 20) | 0.0008 ns | 0.0013 ns | 0.0012 ns | 0.000 |       5 B |
| RegularCastProperty |             (10, 20) | 2.3122 ns | 0.0024 ns | 0.0022 ns | 1.000 |      29 B |
|  UnsafeCastProperty | (10, (...)8, 9) [38] | 0.0007 ns | 0.0008 ns | 0.0006 ns | 0.000 |       5 B |
| RegularCastProperty | (10, (...)8, 9) [38] | 2.1110 ns | 0.0080 ns | 0.0075 ns | 1.000 |      29 B |

The numbers are more or less the same.

The assembly is virtually identical, only difference being dealing with accessing the value from `[rcx+8]` instead of directly from `rdx`.

```asm
mov       rax,[rcx+8]
ret
```

```asm
sub       rsp,28
mov       rdx,[rcx+8]
mov       rcx,offset MT_System.Runtime.CompilerServices.ITuple
call      CORINFO_HELP_CHKCASTINTERFACE
nop
add       rsp,28
ret
```

#### Summary

Do 2 nanoseconds matter? Most of the time no. But I wanted to look at this anyway.

[1]: https://www.fbnetexternalengine.com
[2]: https://github.com/dotnet/runtime/blob/v6.0.2/src/coreclr/System.Private.CoreLib/src/System/Runtime/CompilerServices/CastHelpers.cs#L398
