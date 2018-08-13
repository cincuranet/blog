---
title: |-
  How is Thread.SpinWait actually implemented?
date: 2018-07-17T18:30:00Z
tags:
  - .NET
  - .NET Core
  - JIT
  - RyuJIT
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
I'm always drawn into disassembling stuff and learning how something works under the hood. The `Thread.SpinWait` is something I'm going to explore. Because .NET Core is open source I can attack this from side of both sources as well as pure disassembly.

<!-- excerpt -->

#### Sources

Let's start simply from sources. Following where the `Thread.SpinWait` goes, I eventually ended up in `internal` (yes, `internal`) class `Thread`, that derives from `RuntimeThread`, where the [`SpinWait` method][1]. This method calls `SpinWaitInternal`, that is conveniently right above. That's where the C# code ends and we need to go lower (in this case the "VM").

The implementation is in [`comsynchronizable.cpp` file, using the FCIMPL1 macro][3] (which I think is an abbreviation for "`fastcall` function implementation with one argument"). It simply checks what the number of iterations is. If it's over 100000 the preemptive mode is used to avoid stalling a GC, else the code stays in cooperative mode. In both cases the `YieldProcessorNormalized` is called passing result from `YieldProcessorNormalizationInfo`.

The [`YieldProcessorNormalized` method][4] calls `YieldProcessor` number of times based on `YieldProcessorNormalizationInfo.yieldsPerNormalizedYield`. The `YieldProcessor` is again a macro, [defined in `gcenv.base.h`][5] (together with `MemoryBarrier`). Looking at it shows that the implementation differs based on platform. For example on AMD64 using Visual C++ it uses `_mm_pause` intrinsic. This eventually puts `pause` instruction into the resulting code. For x86 it simply uses `rep nop`. <small>The important part of that file is included at the bottom as a reference.</small>

Looks like I have the implementation. On platforms where I'm running my code most often, it's simply `pause` instruction.

#### Disassembly

All the above is nice, but what if I've made some mistake? I should be able to see the result in pure disassembly, right? 

I compiled a simple .NET Framework (non-Core) console application with full optimizations enabled and loaded it into WinDbg. Using the _Disassembly_ and _F11_ went deeper and deeper into the code. Eventually I ended in this piece of code for 32bit.

```asm
7217f56c 8bf1            mov     esi,ecx
7217f56e 8975e4          mov     dword ptr [ebp-1Ch],esi
7217f571 bf60f51772      mov     edi,offset clr!ThreadNative::SpinWait (7217f560)
7217f576 897de0          mov     dword ptr [ebp-20h],edi ss:002b:00f3ee58=00000000
7217f579 81fe40420f00    cmp     esi,0F4240h
7217f57f 0f8f26492100    jg      clr!ThreadNative::SpinWait+0x35 (72393eab)
7217f585 85f6            test    esi,esi
7217f587 7e07            jle     clr!ThreadNative::SpinWait+0x123 (7217f590)
7217f589 f390            pause
7217f58b 83ee01          sub     esi,1
7217f58e 75f9            jne     clr!ThreadNative::SpinWait+0x29 (7217f589)
```

The `pause` instruction is nicely there and the `esi` register is used to count (down) the iterations.

For 64bit, the code obviously still uses `pause`, but the looping is done slightly differently.

```asm
00007ffe`b5a2b556 33db            xor     ebx,ebx
00007ffe`b5a2b558 81f940420f00    cmp     ecx,0F4240h
00007ffe`b5a2b55e 7f0e            jg      clr!ThreadNative::SpinWait+0x4e (00007ffe`b5a2b56e)
00007ffe`b5a2b560 3bd9            cmp     ebx,ecx
00007ffe`b5a2b562 0f8dc5010000    jge     clr!ThreadNative::SpinWait+0x20d (00007ffe`b5a2b72d)
00007ffe`b5a2b568 f390            pause
00007ffe`b5a2b56a ffc3            inc     ebx
00007ffe`b5a2b56c ebf2            jmp     clr!ThreadNative::SpinWait+0x40 (00007ffe`b5a2b560)
```

The `ebx` (`rbx`) register is incremented and compared with `ecx` (`rcx`) where the total number of interations is stored.

The decision for cooperative or preemptive mode is visible in both with `cmp` with `0F4240h` value.

#### Summary

True, for day-to-day programming in .NET one does not need to know this, heck one does not need `Thread.SpinWait` at all, and I know it. So what's the reason for all this? I like such disassembling (pun intended). It keeps my brain occupied and sometimes stretches my abilities, thus I'm learning new stuff.

#### Appendix

##### `YieldProcessor` macro etc. in `gcenv.base.h`

```c
#if defined(_MSC_VER) 
 #if defined(_ARM_)

  __forceinline void YieldProcessor() { }
  extern "C" void __emit(const unsigned __int32 opcode);
  #pragma intrinsic(__emit)
  #define MemoryBarrier() { __emit(0xF3BF); __emit(0x8F5F); }

 #elif defined(_ARM64_)

  extern "C" void __yield(void);
  #pragma intrinsic(__yield)
  __forceinline void YieldProcessor() { __yield();}

  extern "C" void __dmb(const unsigned __int32 _Type);
  #pragma intrinsic(__dmb)
  #define MemoryBarrier() { __dmb(_ARM64_BARRIER_SY); }

 #elif defined(_AMD64_)
  
  extern "C" void
  _mm_pause (
      void
      );
  
  extern "C" void
  _mm_mfence (
      void
      );

  #pragma intrinsic(_mm_pause)
  #pragma intrinsic(_mm_mfence)
  
  #define YieldProcessor _mm_pause
  #define MemoryBarrier _mm_mfence

 #elif defined(_X86_)
  
  #define YieldProcessor() __asm { rep nop }
  #define MemoryBarrier() MemoryBarrierImpl()
  __forceinline void MemoryBarrierImpl()
  {
      int32_t Barrier;
      __asm {
          xchg Barrier, eax
      }
  }

 #else // !_ARM_ && !_AMD64_ && !_X86_
  #error Unsupported architecture
 #endif
#else // _MSC_VER

// Only clang defines __has_builtin, so we first test for a GCC define
// before using __has_builtin.

#if defined(__i386__) || defined(__x86_64__)

#if (__GNUC__ > 4 && __GNUC_MINOR > 7) || __has_builtin(__builtin_ia32_pause)
 // clang added this intrinsic in 3.8
 // gcc added this intrinsic by 4.7.1
 #define YieldProcessor __builtin_ia32_pause
#endif // __has_builtin(__builtin_ia32_pause)

#if defined(__GNUC__) || __has_builtin(__builtin_ia32_mfence)
 // clang has had this intrinsic since at least 3.0
 // gcc has had this intrinsic since forever
 #define MemoryBarrier __builtin_ia32_mfence
#endif // __has_builtin(__builtin_ia32_mfence)

// If we don't have intrinsics, we can do some inline asm instead.
#ifndef YieldProcessor
 #define YieldProcessor() asm volatile ("pause")
#endif // YieldProcessor

#ifndef MemoryBarrier
 #define MemoryBarrier() asm volatile ("mfence")
#endif // MemoryBarrier

#endif // defined(__i386__) || defined(__x86_64__)

#ifdef __aarch64__
 #define YieldProcessor() asm volatile ("yield")
 #define MemoryBarrier __sync_synchronize
#endif // __aarch64__

#ifdef __arm__
 #define YieldProcessor()
 #define MemoryBarrier __sync_synchronize
#endif // __arm__

#endif // _MSC_VER
```

[1]: https://github.com/dotnet/coreclr/blob/0fbd855e38bc3ec269479b5f6bf561dcfd67cbb6/src/System.Private.CoreLib/src/System/Threading/Thread.cs#L325
[2]: https://github.com/dotnet/coreclr/blob/0fbd855e38bc3ec269479b5f6bf561dcfd67cbb6/src/System.Private.CoreLib/src/System/Threading/Thread.cs#L321
[3]: https://github.com/dotnet/coreclr/blob/0fbd855e38bc3ec269479b5f6bf561dcfd67cbb6/src/vm/comsynchronizable.cpp#L1648
[4]: https://github.com/dotnet/coreclr/blob/0fbd855e38bc3ec269479b5f6bf561dcfd67cbb/src/vm/yieldprocessornormalized.h#L36
[5]: https://github.com/dotnet/coreclr/blob/0fbd855e38bc3ec269479b5f6bf561dcfd67cbb/src/gc/env/gcenv.base.h#L161