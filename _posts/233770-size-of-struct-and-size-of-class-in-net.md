---
title: |-
  Size of struct and size of class in .NET
date: 2019-02-11T19:30:00Z
tags:
  - .NET
  - .NET Core
---
I was playing with structs and classes recently and found something I had no idea .NET does. Although it's not something groundbreaking, I'll share it with you anyway.

<!-- excerpt -->

Can you guess the size of this structure?

```csharp
struct S
{
    bool b1;
    int i1;
    bool b2;
}
```

Yes, it's 12 bytes (on x86). The `bool` fields are padded (basically for alignment and interoperability with Win32 API P/Invoke). So, it's 1B `bool` + 3B padding + 4B `int` + 1B `bool` + 3B padding. This is kind of expected, if you've been around .NET for a while.

But what happens when I change it to class?

```csharp
class C
{
    bool b1;
    int i1;
    bool b2;
}
```

Surprisingly for me, it becomes 8 bytes. Because the class is a reference to some memory, it's not expected you use it for marshaling data between different environments like managed .NET code and unmanaged native code, hence the runtime can reorder the fields to better use the memory. In this case it would do 4B `int` + 1B `bool` + 1B `bool` + 2B padding.

I know I can play with `StructLayout` and even use explicit layout with offsets, it's just interesting to see the behavior for classes.