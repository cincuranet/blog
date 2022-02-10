---
title: |-
  Attribute on attribute itself
date: 2022-02-10T07:39:00Z
tags:
  - C#
---
Today I learned that you could use attribute, in C#, on itself. 🤯 Not sure why would I do that, but it's cool.

<!-- excerpt -->

This simple C# code...

```csharp
[My]
public class MyAttribute : Attribute
{ }
```

...compiles into this IL just fine.

```text
.class public auto ansi beforefieldinit MyAttribute
    extends [System.Private.CoreLib]System.Attribute
{
    .custom instance void MyAttribute::.ctor() = (
        01 00 00 00
    )
    // Methods
    .method public hidebysig specialname rtspecialname 
        instance void .ctor () cil managed 
    {
        // Method begins at RVA 0x2050
        // Code size 7 (0x7)
        .maxstack 8

        IL_0000: ldarg.0
        IL_0001: call instance void [System.Private.CoreLib]System.Attribute::.ctor()
        IL_0006: ret
    } // end of method MyAttribute::.ctor

} // end of class MyAttribute
```

I, obviously, never needed that before. And I don't know what I would use it realistically for. But I'll put this into "cool facts for beer talk" drawer.
