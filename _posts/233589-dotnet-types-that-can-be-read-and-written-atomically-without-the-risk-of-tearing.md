---
title: |-
  .NET types that can be read and written atomically without the risk of tearing
date: 2016-12-12T15:07:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - .NET
  - .NET Core
---
I'm currently digging deep into memory models, processor architectures, kernels and so on. It's a fun stuff. I'm learning so much and my brain is working so hard. With that I'm also digging into some "concurrent" internals in .NET, in last few days the [`ConcurrentDictionary<TKey, TValue>` class][2]. As I was there I found something helpful.

<!-- excerpt -->

Take a look [here][1]. It's a list of types where tearing doesn't happen. Of course unless misaligned manually. Awesome!

```csharp
/// <summary>
/// Determines whether type TValue can be written atomically
/// </summary>
private static bool IsValueWriteAtomic()
{
    //
    // Section 12.6.6 of ECMA CLI explains which types can be read and written atomically without
    // the risk of tearing.
    //
    // See http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-335.pdf
    //
    Type valueType = typeof(TValue);
    bool isAtomic =
        !valueType.GetTypeInfo().IsValueType ||
        valueType == typeof(bool) ||
        valueType == typeof(char) ||
        valueType == typeof(byte) ||
        valueType == typeof(sbyte) ||
        valueType == typeof(short) ||
        valueType == typeof(ushort) ||
        valueType == typeof(int) ||
        valueType == typeof(uint) ||
        valueType == typeof(float);

    if (!isAtomic && IntPtr.Size == 8)
    {
        isAtomic =
            valueType == typeof(double) ||
            valueType == typeof(long) ||
            valueType == typeof(ulong);
    }

    return isAtomic;
}
```

Although I said it's helpful, I don't that mean anybody should rely on that. It's good as brain training. Not for production level code. There's a gazillion pieces that need to fit together to work correctly (platform, it's memory model; compiler; JIT optimizations; ...).

But for studying... Oh my.

[1]: https://github.com/dotnet/corefx/blob/051b8f486b4383e43173521ac1ad79865b850b72/src/System.Collections.Concurrent/src/System/Collections/Concurrent/ConcurrentDictionary.cs#L87
[2]: https://msdn.microsoft.com/en-us/library/dd287191(v=vs.110).aspx