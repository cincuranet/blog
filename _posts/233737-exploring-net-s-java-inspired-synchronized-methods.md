---
title: |-
  Exploring .NET's - Java inspired - "synchronized" methods
date: 2018-08-13T08:19:00Z
tags:
  - .NET
  - .NET Core
  - JIT
  - RyuJIT
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Java
---
I was recently talking about first versions of .NET, C# and the world of development technologies of that time. As I briefly touched J# (anybody remembers?) I realized there's one Java feature that was added to C# because of inspiration by Java and I wanted to explore it. It's not much used or even known in C#, but it's still there. And because it's about "threading and synchronization" I couldn't resist and immediately jumped in. It's _synchronized_ methods.

<!-- excerpt -->

#### Java

In Java you can write code like this.

```java
public synchronized void foo() {
	System.out.println("synchronized");
}
```

The `synchronized` keyword is what's interesting. In simple language it means, the `foo` method can be executed only by one thread at any given time. Complete description, i.e. memory ordering, can be found in the [docs][1].

#### C#

Although there's no `synchronized` keyword in C#, it exists in IL. The chapter "II.15.4.3.3 Implementation information" of [ECMA 335 specification][2] lists attributes that the method can have and the meaning. The `synchronized` is declared as follows.

> synchronized specifies that the whole body of the method shall be single-threaded. If this method is an instance or virtual method, a lock on the object shall be obtained before the method is entered. If this method is a static method, a lock on the closed type shall be obtained before the method is entered. If a lock cannot be obtained, the requesting thread shall not proceed until it is granted the lock. This can cause deadlocks. The lock is released when the method exits, either through a normal return or an exception.  Exiting a synchronized method using a tail. call shall be implemented as though the tail. had not been specified.

To have this attribute on a method from C# you have to use `MethodImpl` attribute with `MethodImplOptions.Synchronized` value.

```csharp
[MethodImpl(MethodImplOptions.Synchronized)]
public void Foo()
{
	Console.WriteLine("synchronized");
}
```

This method is then conceptually same as this (for non-static methods).

```csharp
public void Foo()
{
	lock (this)
	{
		Console.WriteLine("synchronized");
	}
}
```

But what's really inside?

#### Resulting code

Without much hesitation let's jump into WinDbg and see the resulting code in a raw form. Here's the interesting fragment using .NET Core 2.1 x64.

Using `MethodImplOptions.Synchronized`.

```asm
00007ff9`dea414d0 55              push    rbp
00007ff9`dea414d1 56              push    rsi
00007ff9`dea414d2 4883ec38        sub     rsp,38h
00007ff9`dea414d6 488d6c2440      lea     rbp,[rsp+40h]
00007ff9`dea414db 33c0            xor     eax,eax
00007ff9`dea414dd 488945e8        mov     qword ptr [rbp-18h],rax
00007ff9`dea414e1 488965e0        mov     qword ptr [rbp-20h],rsp
00007ff9`dea414e5 488bf1          mov     rsi,rcx
00007ff9`dea414e8 33d2            xor     edx,edx
00007ff9`dea414ea 8955f0          mov     dword ptr [rbp-10h],edx
00007ff9`dea414ed 488975e8        mov     qword ptr [rbp-18h],rsi
00007ff9`dea414f1 488d55f0        lea     rdx,[rbp-10h]
00007ff9`dea414f5 488bce          mov     rcx,rsi
00007ff9`dea414f8 e893f7c65f      call    coreclr!JIT_MonEnterWorker_Portable (00007ffa`3e6b0c90)
00007ff9`dea414fd 48b96830667407020000 mov rcx,20774663068h
00007ff9`dea41507 488b09          mov     rcx,qword ptr [rcx]
00007ff9`dea4150a e829feffff      call    00007ff9`dea41338
00007ff9`dea4150f 488d55f0        lea     rdx,[rbp-10h]
00007ff9`dea41513 488bce          mov     rcx,rsi
00007ff9`dea41516 e855f9c65f      call    coreclr!JIT_MonExitWorker_Portable (00007ffa`3e6b0e70)
00007ff9`dea4151b 90              nop
00007ff9`dea4151c 488d65f8        lea     rsp,[rbp-8]
00007ff9`dea41520 5e              pop     rsi
00007ff9`dea41521 5d              pop     rbp
00007ff9`dea41522 c3              ret
```

Using `Monitor`/`lock`.

```asm
00007ff9`dea72a70 55              push    rbp
00007ff9`dea72a71 4883ec30        sub     rsp,30h
00007ff9`dea72a75 488d6c2430      lea     rbp,[rsp+30h]
00007ff9`dea72a7a 33c0            xor     eax,eax
00007ff9`dea72a7c 488945f8        mov     qword ptr [rbp-8],rax
00007ff9`dea72a80 488965f0        mov     qword ptr [rbp-10h],rsp
00007ff9`dea72a84 48894d10        mov     qword ptr [rbp+10h],rcx
00007ff9`dea72a88 33d2            xor     edx,edx
00007ff9`dea72a8a 8955f8          mov     dword ptr [rbp-8],edx
00007ff9`dea72a8d 807df800        cmp     byte ptr [rbp-8],0
00007ff9`dea72a91 750f            jne     00007ff9`dea72aa2
00007ff9`dea72a93 488d55f8        lea     rdx,[rbp-8]
00007ff9`dea72a97 488b4d10        mov     rcx,qword ptr [rbp+10h]
00007ff9`dea72a9b e8402fa15f      call    coreclr!JIT_MonReliableEnter_Portable (00007ffa`3e4859e0)
00007ff9`dea72aa0 eb06            jmp     00007ff9`dea72aa8
00007ff9`dea72aa2 e8a9bf9d52      call    System_Private_CoreLib!System.Threading.Monitor.ThrowLockTakenException()$##6002507 (00007ffa`3144ea50)
00007ff9`dea72aa7 cc              int     3
00007ff9`dea72aa8 48b9a8304ae25a020000 mov rcx,25AE24A30A8h
00007ff9`dea72ab2 488b09          mov     rcx,qword ptr [rcx]
00007ff9`dea72ab5 e8262d697a      call    System_Console!System.Console.WriteLine(System.String)$##6000083 (00007ffa`591057e0)
00007ff9`dea72aba 90              nop
00007ff9`dea72abb 807df800        cmp     byte ptr [rbp-8],0
00007ff9`dea72abf 7409            je      00007ff9`dea72aca
00007ff9`dea72ac1 488b4d10        mov     rcx,qword ptr [rbp+10h]
00007ff9`dea72ac5 e89655a35f      call    coreclr!JIT_MonExit_Portable (00007ffa`3e4a8060)
00007ff9`dea72aca 90              nop
00007ff9`dea72acb 488d6500        lea     rsp,[rbp]
00007ff9`dea72acf 5d              pop     rbp
00007ff9`dea72ad0 c3              ret
```

The first code is calling `JIT_MonEnterWorker_Portable` and `JIT_MonExitWorker_Portable`. The other code is using `JIT_MonReliableEnter_Portable` and `JIT_MonExit_Portable`. The "enter" methods are defined in `jithelpers.cpp` [here][3] and [here][4] respectively. These methods do basically the same logic, minus some structural differences. The `lock` version is obviously bit longer with some additional logic (i.e. conditional `ThrowLockTakenException`) because that's how `lock` is compiled.

#### Summary

The "synchronized" method is - for outside observer - same as using the `Monitor`/`lock`. No magic here. It's also nice to see how the same pieces are reused in different layers.

[1]: https://docs.oracle.com/javase/tutorial/essential/concurrency/syncmeth.html
[2]: https://www.ecma-international.org/publications/files/ECMA-ST/ECMA-335.pdf
[3]: https://github.com/dotnet/coreclr/blob/6bf04a47badd74646e21e70f4e9267c71b7bfd08/src/vm/jithelpers.cpp#L4382
[4]: https://github.com/dotnet/coreclr/blob/6bf04a47badd74646e21e70f4e9267c71b7bfd08/src/vm/jithelpers.cpp#L4409