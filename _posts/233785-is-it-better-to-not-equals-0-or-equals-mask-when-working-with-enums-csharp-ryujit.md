---
title: |-
  Is it better to "!= 0" or "== mask" when working with enums (C#, RyuJIT)
date: 2019-05-20T19:22:00Z
tags:
  - .NET Core
  - JIT
  - RyuJIT
---
First thing first, I know there's an [`Enum.HasFlag` method][1], yet I'm not interested in it (or optimizations around it). What I like to know is whether one of these two ways - `(EnumValue & mask) != 0` and `(EnumValue & mask) == mask` - to check for a (**single value**) flag in an enum is better.

<!-- excerpt -->

I'm writing _better_, because I don't want to say faster, as other aspects of such primitive operation might affect the overall result (like code size, register usage, etc.).

#### Hypothesis

My guess is that the "!= 0" is going be the winner, because computers are good doing stuff around value zero (like `jnz` instruction).

#### Code

In all the code following, I'll be using this enum I aptly named `MyEnum`. Nothing special.

```csharp
[Flags]
public enum MyEnum
{
    None = 0,
    A = 0x01,
    B = 0x02,
    C = 0x04,
    D = 0x08,
}
```

And two simple methods (with x64/AMD64 assembly right below each).

```csharp
public bool A(MyEnum myEnum)
{
    return (myEnum & MyEnum.B) == MyEnum.B;
}
```

```asm
test dl, 0x2
setnz al
movzx eax, al
ret
```

```csharp
public bool B(MyEnum myEnum)
{
    return (myEnum & MyEnum.B) != 0;
}
```

```asm
test dl, 0x2
setnz al
movzx eax, al
ret
```

Surprisingly both result in exactly the same assembly produced by 64-bit RyuJIT (on .NET Core 2.2.4). Although, it kind of makes sense, both are doing the same. I also learned about `setnz` and `movzx` instructions (the `movzx` strictly speaking is the for returning the value, not for the compare) along the way, as I wasn't familiar with these.

I could stop here and say that both are the same and use whatever I feel like using given the circumstances. But I like to look under.

#### Where's the magic happening in RyuJIT

I'm nowhere familiar of internals of RyuJIT, thus I had no idea where is this happening. Time for little thinking. I'm working with enums, but enums are just numbers, hence maybe the same behavior works for numbers too. That way I know whether to keep _grepping_ for something around enums or look for something more general.

Sadly doing `(value & 0x02) == 0x02` and `(value & 0x02) != 0` (where `value` is plain `int`) shows same behavior. I'll spare you my two hours of semi-methodically (read randomly :)) walking through the RyuJIT's code and I'll jump right into the action.

The first magic happens in `Lowering::OptimizeConstCompare`, where [the "compare and" is transformed into "test"][2] and even ["inventing" the `0` comparison if possible][3]. That covers transforming "== mask" into "!= 0". The other part of the puzzle can be found in [the code generation itself][4]. The `test reg, reg` instruction is shorter than doing `cmp reg, 0`. And although the saving is not huge (1 byte), if you're writing JIT, every byte and CPU cycle more than counts.

Moreover, as I was researching, I learned about [macro-fusing instructions][5] in certain architectures and `test` can (i.e. Intel Core 2, Intel Nehalem, ...) macro-fuse with more conditional jump instructions, compared to `cmp`.

#### Real world usage

Above I said, that both are the same. But carefully looking into `Lowering::OptimizeConstCompare` at [this line][6], one can see the `0` comparison is "invented" only if the second operand is integral single bit mask constant. That means, if you have a code, where the "mask" is i.e. a variable, it's better to use "!= 0" if you can, else you're out of luck with RyuJIT's smartness.

```csharp
public bool A(MyEnum myEnum, MyEnum value)
{
    return (myEnum & value) == value;
}
```

```asm
and edx, r8d
cmp edx, r8d
setz al
movzx eax, al
ret
```

```csharp
public bool B(MyEnum myEnum, MyEnum value)
{
    return (myEnum & value) != 0;
}
```

```asm
test r8d, edx
setnz al
movzx eax, al
ret
```

#### Summary

Although my hypothesis with "!= 0" was correct, I learned the direct "compare" with `0` wasn't really the reason. Quite the opposite. And finally, I spent time learning something new and it was fun.

<small>In case you'd ask; the [`Enum.HasFlag` is optimized and doing the same at the end][7].</small>

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.enum.hasflag
[2]: https://github.com/dotnet/coreclr/blob/c5a44f58952c5014f5e1c25b667dca3901fd84a7/src/jit/lower.cpp#L2644
[3]: https://github.com/dotnet/coreclr/blob/c5a44f58952c5014f5e1c25b667dca3901fd84a7/src/jit/lower.cpp#L2653-L2654
[4]: https://github.com/dotnet/coreclr/blob/c5a44f58952c5014f5e1c25b667dca3901fd84a7/src/jit/codegenxarch.cpp#L6351-L6352
[5]: https://en.wikichip.org/wiki/macro-operation_fusion
[6]: https://github.com/dotnet/coreclr/blob/c5a44f58952c5014f5e1c25b667dca3901fd84a7/src/jit/lower.cpp#L2657
[7]: https://github.com/dotnet/coreclr/blob/c5a44f58952c5014f5e1c25b667dca3901fd84a7/src/jit/gentree.cpp#L12862