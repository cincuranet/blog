---
title: |-
  Where are the differences in execution speed of various method types come from (.NET)?
date: 2017-11-27T08:00:01Z
tags:
  - .NET
  - .NET Core
  - JIT
  - RyuJIT
---
In [previous post][1] I measured execution speed of static and instance methods. Here I'll dig deeper and I'll try to find where the difference comes from. Bear in mind, I don't have a deep knowledge of processors, JIT or assembly. I'm just thinking out loud, poking and observing.

<!-- excerpt -->

#### Thinking

What's the main difference between static and instance method? Yes. The `this` parameter. And also whether the call is direct or indirect (aka _virtual_). Could these two pieces be the reason for the speed difference?

Passing the `this` argument is not eating too much of time as one can easily prove comparing times for `Static0` and `Static2` in [previous post][1]. These times are virtually the same (RyuJIT on .NET 64-bit times I consider being an exception rather than a rule). But the `this` argument also needs to be validated that it's not `null`. In case of virtual call, the address of method to be called needs to be found.

#### What is processor instructed to do

Static method call.

```asm
00007FF86D6304C4  call        00007FF86D6300A8
```

And compare this to direct instance method call.

```asm
00007FF86D6204C4  cmp         dword ptr [rcx],ecx
00007FF86D6204C6  call        00007FF86D6200B0
```

Awesome. The `cmp [rcx], ecx` is clearly the validation of `this`. Looking at generated assembly for various method I'm pretty sure both CLR and CoreCLR are using [_fastcall_-like calling convention][2] (in the assembly snippet above [in 64-bit version][3]). In this convention the `RCX` register is first integer argument. In common languages that's where the `this` is. The result of `cmp` is not used, but that's fine. Just trying to dereference the `RCX` in case it's `null`/`0`, will raise [_segfault_][4] and subsequently [`NullReferenceException`][5]. Moving forward to virtual call.

```asm
00007FF86D6004C4  mov         r11,7FF86D500020h
00007FF86D6004CE  cmp         dword ptr [rcx],ecx
00007FF86D6004D0  call        qword ptr [r11]
```

Exactly as expected. The `null` check is still there, plus now the call goes via the `R11` register's value, not address directly (By the way, there's [an effort in CoreCLR to devirtualize][6] (not only) such calls.).

Just in case you'd like to see how it would look like for structures, I looked at that as well.

```asm
00007FF86D6104C4  mov         qword ptr [rsp+30h],rcx
00007FF86D6104C9  lea         rcx,[rsp+30h]
00007FF86D6104CE  call        00007FF86D610098
```

Awesome again. Structures are value types, thus cannot be `null`, therefore the `null` check is not there.

#### Conclusion

All this together, it's clear why the static method is fastest and virtual call slowest. There's simply more work to be done.

As I said at the beginning I'm not an expert in processors, JIT or assembly. I was connecting the dots and trying how changing this changes that and whether I can pair it with some other stuff I already knew. At the end this isn't useful for day to day .NET programming, but, hey, the road to the knowledge was an absolute blast.

[1]: {% include post_link, id: "233660" %}
[2]: https://en.wikipedia.org/wiki/X86_calling_conventions#Microsoft_fastcall
[3]: https://en.wikipedia.org/wiki/X86_calling_conventions#Microsoft_x64_calling_convention
[4]: https://en.wikipedia.org/wiki/Segmentation_fault
[5]: https://docs.microsoft.com/en-us/dotnet/api/system.nullreferenceexception?view=netframework-4.7.1
[6]: https://github.com/dotnet/coreclr/issues/9908