---
title: "Concatenating(?) string during compile"
date: 2007-04-28T21:34:00Z
tags:
  - .NET
layout: post
---
I'm writing a simple library for reading some data from one Firebird database, it's not important... For better readability I'm creating CommandText as a string on more lines with some formatting. Because the performance was one of the criterion, I was not so comfortable assigning selects like this (everybody knows, that StringBuilder class is a lot faster when concatenating strings). But as you can expect (and me too), smart compiler creates this string (there's no variable in it) during compile time as one big, isn't it? Yeah. However why not to calm down myself with a hundred percent proof?

I've created small application only with:

```csharp
string s = string.Empty;
s = "rrr" +
"rrr";
```

in Main method. I used ILDasm tool from SDK to convince myself that it's true:

```text
.method private hidebysig static void Main(string[] args) cil managed
{
.entrypoint
// Code size 14 (0xe)
.maxstack 1
.locals init ([0] string s)
IL_0000: nop
IL_0001: ldsfld string [mscorlib]System.String::Empty
IL_0006: stloc.0
IL_0007: ldstr "rrrrrr"
IL_000c: stloc.0
IL_000d: ret
} // end of method Program::Main
```

And as you can see, the string is created as one piece, as I (and I hope you too) expected. Well, now I have better sleeping when showing the code of the library.

Note, that:

```csharp
s += "rrr";
s += "rrr";
```

are completely different statements (there are two String.Concat commands).