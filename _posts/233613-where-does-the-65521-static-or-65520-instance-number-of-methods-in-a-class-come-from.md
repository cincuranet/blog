---
title: |-
  Where does the 65521 (static) or 65520 (instance) number of methods in a class come from?
date: 2017-04-14T19:55:00Z
tags:
  - .NET
  - C#
---
If you have been following last two posts about the stack overflows ([post 1][1], [post 2][2]), you know I've hit some limits. The first was 65535 fields in a class. Which is easy to explain, because the number is actually the maximum value that fits into unsigned 16-bit integer. Makes sense. Then I've hit some weird number (or actually numbers) for number of methods. It took me quite a while, with some help, to understand, what the number is based on.

<!-- excerpt -->

#### Small recap

The number (of methods) I'm talking here about is 65521 for static and 65520 for instance classes. You can compile (currently) class with more methods, but the CLR will not load it. You'll get very clean and descriptive exception (my class is `MethodsTest.BigAssClass`).

```text
System.TypeLoadException: Type 'MethodsTest.BigAssClass' from assembly 'MethodsTest, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' contains more methods than the current implementation allows.
```

Let's start thinking (preferably) and digging (if needed).

#### Why there's a difference between static and instance classes?

This one is easy to crack. Every instance class has a constructor. Even if you don't write one yourself, it's there, empty. And because static classes do not have it, you can have one extra method there.

#### Remaining methods idea #1 (wrong)

Because of the constructor, I thought, what if there are some methods inherited from parent object taking up the spots? The parent object, unless explicitly specified is `System.Object`. Thanks to the available sources, I can easily investigate.

Quick looks into [sources][3] shows there's indeed some methods that could be somehow taking up some spots. There are the well known ones like `ToString`, `GetType`, `GetHashCode` and even the constructor. But there's more: `Equals` (2x), `ReferenceEquals`, `Finalize` (`~Object`), `MemberwiseClone`, `FieldSetter`, `FieldGetter`, `GetFieldInfo`. Looking at the list, it looks like it might be it. Sadly it's only 12 methods. That's not enough.

Maybe something is injected by JIT for internal use? Time for _WinDbg_. Dumping the _method table_ reveals I'm not on the right path. Except for my methods, there's only some of these.

```text
71cfccf8 71977974 PreJIT System.Object.ToString()
71ce9dd0 7197797c PreJIT System.Object.Equals(System.Object)
71d9d8a0 7197799c PreJIT System.Object.GetHashCode()
71cd5c78 719779b0 PreJIT System.Object.Finalize()
```

This got me nowhere. Here I also realized I could have tested it way easier by creating my own base class with bunch of methods to go over the limit, while keeping the `BigAssClass` in the limit. In fact I did that later, out of curiosity (yes it works fine, if you'd like to ask).

#### Remaining methods idea #2 (even more wrong)

I decided to zoom out a little and look at the numbers. The 65520 is `0xFFF0`, interesting. And even more interesting is the 65521. It's the largest prime number less or equal to 65535. That must mean something. I'm not going to bother you with details, because all these observations - although interesting - just got me nowhere.

#### Remaining methods idea #3 - time to get deeper

Since the previous two attempts brought me nowhere close to the understanding, I made a decision to be methodical. Let's first try to find the message somewhere in the [CoreCLR sources][4]. Although I was running on standard .NET a quick test on .NET Core proved it's happening there as well and with the same exception. The message comes from `IDS_CLASSLOAD_TOO_MANY_METHODS` which is, sadly, used on multiple places.

Maybe with the underlying unmanaged exception and some PDBs I could get closer to what I'm looking for.

```text
Exception thrown at 0x000007FEFD35A06D in MethodsTest.exe: Microsoft C++ exception: EETypeLoadException at memory location 0x000000000027AFD0.
```

And some stack trace.

```text
Current frame: KERNELBASE!RaiseException+0x58
ChildEBP RetAddr  Caller, Callee
0070e234 7500c54f KERNELBASE!RaiseException+0x58, calling ntdll!RtlRaiseException
0070e27c 72fb352f clr!RaiseTheExceptionInternalOnly+0x27c, calling KERNEL32!RaiseExceptionStub
0070e2c0 751614ad KERNEL32!HeapFree+0x14, calling ntdll!RtlFreeHeap
0070e318 730dc0cb clr!UnwindAndContinueRethrowHelperAfterCatch+0x90, calling clr!RaiseTheExceptionInternalOnly
0070e348 730f18a8 clr!CEEInfo::resolveToken+0x5a8, calling clr!UnwindAndContinueRethrowHelperAfterCatch
0070e384 777a09ae ntdll!RtlpValidateHeap+0x20, calling ntdll!RtlpValidateHeapHeaders
0070e3dc 70f41939 clrjit!Compiler::impResolveToken+0x48
0070e3f4 70f42024 clrjit!Compiler::impImportBlockCode+0x2ef3, calling clrjit!Compiler::impResolveToken
0070e418 777a1958 ntdll!RtlDebugFreeHeap+0x276, calling ntdll!RtlLeaveCriticalSection
0070e420 777a193c ntdll!RtlDebugFreeHeap+0x25f, calling ntdll!_SEH_epilog4
0070e458 777a193c ntdll!RtlDebugFreeHeap+0x25f, calling ntdll!_SEH_epilog4
0070e45c 7775a863 ntdll!RtlpFreeHeap+0x5d, calling ntdll!RtlDebugFreeHeap
0070e468 77702fdd ntdll!RtlpFreeHeap+0xb7a, calling ntdll!_SEH_epilog4
0070e4dc 77703406 ntdll!RtlpAllocateHeap+0xe68, calling ntdll!_SEH_epilog4
0070e4e0 77703431 ntdll!RtlAllocateHeap+0x23a, calling ntdll!RtlpAllocateHeap
0070e54c 77702fdd ntdll!RtlpFreeHeap+0xb7a, calling ntdll!_SEH_epilog4
0070e550 77702bd5 ntdll!RtlFreeHeap+0x142, calling ntdll!RtlpFreeHeap
0070e570 751614ad KERNEL32!HeapFree+0x14, calling ntdll!RtlFreeHeap
0070e584 72e2c43e clr!EEHeapFree+0x3b, calling KERNEL32!HeapFree
0070e59c 72e2c46d clr!EEHeapFreeInProcessHeap+0x2f, calling clr!EEHeapFree
```

I wouldn't say it helped a much. I have the `clrjit.dll!Compiler::impImportBlockCode`, `clrjit.dll!Compiler::impResolveToken` and `clr!CEEInfo::resolveToken` to look at and around.

Methodical approach out of the window, let's jump around in the memory in _WinDbg_ and hope for the best. Yep, I'm getting desperate.

#### Remaining methods idea #4 - solution, finally

As I was jumping around in the memory in _method tables_ and _method descriptors_ I realized something. With the class as big as possible while still being able to load it, the _WinDbg_ says `Slots in VTable: 65525`. Wait a minute.

There are some methods from `System.Object`. Remember?

```text
71cfccf8 71977974 PreJIT System.Object.ToString()
71ce9dd0 7197797c PreJIT System.Object.Equals(System.Object)
71d9d8a0 7197799c PreJIT System.Object.GetHashCode()
71cd5c78 719779b0 PreJIT System.Object.Finalize()
```

I was onto something in the first attempt. What these methods have in common? Except for the `Finalize` (which has special syntax in C# anyway), all are virtual. That makes sense. I can do the same with my own base class, where base class virtual methods take up the spots in derived class.

But why I'm stuck at 65525? Shouldn't I be able to go to 65535 all together? At this point I decided to ask somebody "who knows". Because even if I would be able to find the spot where some size checking (or something like that) happens, I might not be lucky to understand **why** is that from the adjacent code.

Defeated  I reached to Jan Kotas from Core CLR team (As it turned out he's from Czech Republic as I am, what a coincidence.), and he kindly explained me the situation. There are 10 "special" slot numbers reserved. Mostly to be able to capture some effective implementation. Right now there's only one - [`NO_SLOT`][5]. There was more in previous versions and the 10 is still reserved for the future, just in case. Eureka! That's where the missing 10 spots are hiding.

#### Summary

The limit is really 65535 methods in one class. But some spots are already occupied. For instance class one spot is taken by constructor. Another three spots are taken by virtual methods from `System.Object`. One by the `Finalize` method. And 10 spots are reserved. Together that's 15 spots taken. 65520 + 15 = 65535. Nice!

I know this has probably no usage for a real world programming in .NET and it's a pure geekiness, but it was fun nonetheless. Trying to get some sense from what I knew (or was able to prove) or was able to collect.

[1]: {{ include "post_link" 233610 }}
[2]: {{ include "post_link" 233611 }}
[3]: http://referencesource.microsoft.com/#mscorlib/system/object.cs,d9262ceecc1719ab
[4]: https://github.com/dotnet/coreclr
[5]: https://github.com/dotnet/coreclr/blob/ad8afe4f8c9537e8652ae35b301366d737bc1e04/src/vm/methodtable.h#L1483