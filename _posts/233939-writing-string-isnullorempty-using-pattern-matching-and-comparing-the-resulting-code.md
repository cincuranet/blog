---
title: |-
  Writing "string.IsNullOrEmpty" using pattern matching and comparing the resulting code 
date: 2024-05-13T11:55:00Z
tags:
  - C#
  - .NET
---
I was working on a codebase the other day and it used heavily the pattern matching features of C#. And as I was writing `string.IsNullOrEmpty` it got me thinking whether I could switch from this very specific method to using (maybe) a more general pattern matching approach. And also, how that compares in performance.

<!-- excerpt -->

Let's start with the syntax you've probably written thousands of times, something like this.

```csharp
public static int Old(string s)
{
	if (string.IsNullOrEmpty(s))
		return -1;
	return s.Length * 2;
}
```

This results in this assembly on x64 using .NET 8.

```text
; Assembly listing for method Test:Old(System.String):int (Tier1)
; Emitting BLENDED_CODE for X64 with AVX - Windows
; Tier1 code
; optimized code
; rsp based frame
; partially interruptible
; No PGO data
; 1 inlinees with PGO data; 0 single block inlinees; 0 inlinees without PGO data

G_M000_IG01:

G_M000_IG02:
       test     rcx, rcx
       je       SHORT G_M000_IG06

G_M000_IG03:
       mov      eax, dword ptr [rcx+0x08]
       test     eax, eax
       je       SHORT G_M000_IG06

G_M000_IG04:
       add      eax, eax

G_M000_IG05:
       ret

G_M000_IG06:
       mov      eax, -1

G_M000_IG07:
       ret

; Total bytes of code 21
```

This will be our baseline.

The first pattern matching syntax I came with is using matching on `Length` property.

```csharp
public static int NewLength(string s)
{
	if (s is null or { Length: 0 })
		return -1;
	return s.Length * 2;
}
```

```text
; Assembly listing for method Test:NewLength(System.String):int (Tier1)
; Emitting BLENDED_CODE for X64 with AVX - Windows
; Tier1 code
; optimized code
; rsp based frame
; partially interruptible
; No PGO data

G_M000_IG01:

G_M000_IG02:
       test     rcx, rcx
       je       SHORT G_M000_IG05

G_M000_IG03:
       mov      eax, dword ptr [rcx+0x08]
       test     eax, eax
       je       SHORT G_M000_IG05
       add      eax, eax

G_M000_IG04:
       ret

G_M000_IG05:
       mov      eax, -1

G_M000_IG06:
       ret

; Total bytes of code 21
```

And as you can see, this results in the same instructions being emitted.

How does that compare to using _list patterns_?

```csharp
public static int NewList(string s)
{
	if (s is null or [])
		return -1;
	return s.Length * 2;
}
```

```text
; Assembly listing for method Test:NewList(System.String):int (Tier1)
; Emitting BLENDED_CODE for X64 with AVX - Windows
; Tier1 code
; optimized code
; rsp based frame
; partially interruptible
; No PGO data

G_M000_IG01:

G_M000_IG02:
       test     rcx, rcx
       je       SHORT G_M000_IG05

G_M000_IG03:
       mov      eax, dword ptr [rcx+0x08]
       test     eax, eax
       je       SHORT G_M000_IG05
       add      eax, eax

G_M000_IG04:
       ret

G_M000_IG05:
       mov      eax, -1

G_M000_IG06:
       ret

; Total bytes of code 21
```

Good, everything is in order. Same thing expressed using slightly different C#, but the assembly is the same (and also the IL).

It all makes sense. The [`string.IsNullOrEmpty`][1]'s implementation is basically the same code, only written in "plain" C#.

But that got me thinking. What if I write it slightly (not too much) confusing. Something like this.

```csharp
public static int Confusing(string s)
{
	if (s is null or { Length: not > 0 })
		return -1;
	return s.Length * 2;
}
```

```text
; Assembly listing for method Test:Confusing(System.String):int (Tier1)
; Emitting BLENDED_CODE for X64 with AVX - Windows
; Tier1 code
; optimized code
; rsp based frame
; partially interruptible
; No PGO data

G_M000_IG01:

G_M000_IG02:
       test     rcx, rcx
       je       SHORT G_M000_IG05

G_M000_IG03:
       mov      eax, dword ptr [rcx+0x08]
       test     eax, eax
       jle      SHORT G_M000_IG05
       add      eax, eax

G_M000_IG04:
       ret

G_M000_IG05:
       mov      eax, -1

G_M000_IG06:
       ret

; Total bytes of code 21
```

This time the `je` instruction is replaced by `jle`, which is fine, because that's what I wrote (well, I wrote the opposite and `not`). And although using regular code you can't make length of a string negative, you can do it with little bit of unsafe code (but it will make runtime/GC very unhappy later) and JIT needs to handle it accordingly.

#### Summary

No matter whether you prefer `string.IsNullOrEmpty(s)` or `s is null or { Length: 0 }` or `s is null or []` (or some other decent form of expressing this), the resulting instructions that CPU needs to process, will be the same.

[1]: https://source.dot.net/#System.Private.CoreLib/src/libraries/System.Private.CoreLib/src/System/String.cs,23a8597f842071f4