---
title: |-
  Are static methods faster in execution compared to instance methods (.NET)?
date: 2017-11-27T08:00:00Z
tags:
  - .NET
  - .NET Core
  - JIT
  - RyuJIT
---
Couple days ago, fellow MVP and colleague [@RobertHaken tweeted][1] from frustration about a refactoring (in this case not a good refactoring) into static methods. And [I immediately started thinking][2] about scenario where the static method might have some tangible benefits compared to instance method. What a better way to improve method execution than speeding it up? Could this be the case?

<!-- excerpt -->

#### Benchmark

I created a simple, yet with specific purpose in mind, class and I'm going to call these methods using _BenchmarkDotNet_.

```csharp
class FooBar : IFooBar
{
	[MethodImpl(MethodImplOptions.NoInlining)]
	public static int Static0() => 6;

	[MethodImpl(MethodImplOptions.NoInlining)]
	public static int Static2(int a, int b) => 6;

	[MethodImpl(MethodImplOptions.NoInlining)]
	public int Instance0() => 6;

	[MethodImpl(MethodImplOptions.NoInlining)]
	public int Instance2(int a, int b) => 6;
}
```

As you can see I applied the [`MethodImplOptions.NoInlining` flag][3] to really measure the _execution_ speed as it would be in regular business-layer-type methods (these are generally not worth inlining). I also created one version without any arguments and one with two `int` arguments, just in case passing reasonable number of arguments would make a significant difference. 

The instance is then held in `readonly` property typed as an interface (that's why the dummy class implements even more dummy `IFooBar`), as it would be in a typical line-of-business application. The creation of the instance is not counted towards the execution time.

#### Numbers

Let's have a look at the .NET Framework 4.7 (CLR 4.0.30319.42000) with 32-bit legacy JIT (v4.7.2600.0) and 64-bit RyuJIT (v4.7.2600.0).

|      Method |       Jit | Platform |      Mean |     Error |    StdDev | Scaled | ScaledSD |
|------------ |---------- |--------- |----------:|----------:|----------:|-------:|---------:|
|     Static0 | LegacyJit |      X86 | 1.1452 ns | 0.0172 ns | 0.0161 ns |   1.00 |     0.00 |
|     Static2 | LegacyJit |      X86 | 1.1437 ns | 0.0122 ns | 0.0114 ns |   1.00 |     0.02 |
|   Instance0 | LegacyJit |      X86 | 1.6129 ns | 0.0124 ns | 0.0116 ns |   1.41 |     0.02 |
|   Instance2 | LegacyJit |      X86 | 1.6506 ns | 0.0151 ns | 0.0141 ns |   1.44 |     0.02 |

|      Method |       Jit | Platform |      Mean |     Error |    StdDev | Scaled | ScaledSD |
|------------ |---------- |--------- |----------:|----------:|----------:|-------:|---------:|
|     Static0 |    RyuJit |      X64 | 0.8303 ns | 0.0098 ns | 0.0091 ns |   1.00 |     0.00 |
|     Static2 |    RyuJit |      X64 | 1.0884 ns | 0.0168 ns | 0.0157 ns |   1.31 |     0.02 |
|   Instance0 |    RyuJit |      X64 | 1.3793 ns | 0.0177 ns | 0.0166 ns |   1.66 |     0.03 |
|   Instance2 |    RyuJit |      X64 | 1.4048 ns | 0.0143 ns | 0.0134 ns |   1.69 |     0.02 |

For .NET Core 2.0.3 (Framework 4.6.25815.02) I measured only 64-bit RyuJIT.

|      Method |      Mean |     Error |    StdDev | Scaled | ScaledSD |
|------------ |----------:|----------:|----------:|-------:|---------:|
|     Static0 | 0.8837 ns | 0.0130 ns | 0.0121 ns |   1.00 |     0.00 |
|     Static2 | 0.8165 ns | 0.0135 ns | 0.0126 ns |   0.92 |     0.02 |
|   Instance0 | 1.0975 ns | 0.0140 ns | 0.0131 ns |   1.24 |     0.02 |
|   Instance2 | 1.3922 ns | 0.0124 ns | 0.0110 ns |   1.58 |     0.02 |

Given this is a micro-benchmark I'm not interested in absolute numbers, but in comparison.

Looking at these numbers, and kind of mentally smoothing out the numbers, it is clear static method beats the instance one, always. The difference isn't insignificant.

#### Reasons

Because the exploring, reasoning and digging deeper went little bit wider than I expected, I decided to split it to two posts for consistency sake. If you're interested into looking under the hood, be my guest [here][4].

#### Conclusion

Does this all mean one should start writing everything in static methods? Absolutely not. The difference in speed will be easily offset by one or two statements later. Or way more, by writing suboptimal code where tens of milliseconds will be lost. Instead of hunting fractions of nanoseconds where it doesn't matter, the big picture needs to be considered.

[1]: https://twitter.com/RobertHaken/status/928796434257891328
[2]: https://twitter.com/cincura_net/status/928875934673002496
[3]: https://docs.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.methodimploptions.noinlining?view=netframework-4.7
[4]: {{ include "post_link" 233661 }}