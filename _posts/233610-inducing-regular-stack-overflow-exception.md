---
title: |-
  Inducing "regular" stack overflow exception
date: 2017-04-07T12:43:00Z
tags:
  - .NET
  - C#
  - Assembly
---
I was watching a [recording from a WUG][1] where my friend [Robert Haken][2] explains memory internals and so on of .NET applications. At one point, while talking about the [stack][3], he said he never saw stack overflow exception other than from a bad recursion. Challenge accepted. :)

<!-- excerpt -->

#### Background

What is a stack? Stack is a piece of memory, where program stores some data (some other data might be on the heap). What probably most developers saw is that the stack contains _stack frames_ or _activation records_. These are put on the stack when method is called and removed when method returns (in general). On the lowest level it's the magic happening in `SP` (and `BP`) register(s) (on x86 architecture). What's also on the stack is arguments and local variables (again, in general, I don't want to go here into too much details). Hence for me to induce stack overflow ([`StackOverflowException`][4] in .NET) I need to either call a lot of methods or have/pass a lot of variables/arguments.

The stack in .NET is by default 1MB in size (256KB in 32b ASP.NET and 512KB in 64b ASP.NET). It can be changed in PE header or i.e. in the constructor of the `Thread` class.

#### Code

I wasn't sure I'll be able to do it, because I might hit some compiler or [JIT][5] limitation before being able to exhaust the stack. And I did. Thanks to it I learned something new as well.

Because I can't use recursion (that's what Robert saw already and I think he's not alone ;)), I'm left with a lot of arguments or local variables. Local variables might be, because these will be unused in my code, optimized away by the compiler, I decided to go with arguments.

I started with a simple `struct` and generating a lot of fields. Because generating method with a lot of arguments seemed lame. The `struct` is a _value type_ thus it will be on the stack and I can use it multiple times if I need more space to be taken. The T4 file comes handy here. Being cocky I started with something like 100 000 fields. What could possibly go wrong...

```csharp
static void Test(BigAssStruct param = default(BigAssStruct))
{ }
```

Compilation went fine, but execution ended with `System.TypeLoadException: Internal limitation: too many fields.`. Dammit. What now? I tried half of the fields and it executed fine. By trying some "computer numbers" I ended up on 65535 (`2^16 - 1`). Great! I learned something! You can't have a `struct` with more than 65535 fields and use it (that's important, because it compiled fine). And now you know it too! There must be some usage for this knowledge.

At the end the template looked like this.

```text
<#@ template debug="false" hostspecific="false" language="C#" #>
<#@ output extension=".cs" #>

#pragma warning disable 0169
struct BigAssStruct
{
<# for (var i = 0; i < 65535; i++) { #>
    int x<#=i#>;
<# } #>
}
#pragma warning restore 0169
```

As you can see I also disabled [warning `0169`][6], else it was slowing down Visual Studio's `Error List` window.

Sadly, running this didn't induce `StackOverflowException`. Bring more arguments!

```text
<#@ template debug="false" hostspecific="false" language="C#" #>
<#@ output extension=".cs" #>

partial class Program
{
    static void Test(
<# for (var i = 0; i < 3; i++) { #>
    BigAssStruct p<#=i#> = default(BigAssStruct),
<# } #>
    BigAssStruct p = default(BigAssStruct)
    )
    { }
}
```

With 4 arguments (3 + 1) I finally saw the `Process is terminated due to StackOverflowException.`. There you have it. Stack overflow without a bad recursion.

#### Exploring

How can I confirm it's really a stack overflow induced by the code and not something from .NET before?

Let's do some math. I have 64k - 1 fields, each field is `int` and I'm running in 32b. 4B * 65535 = 262140B for each argument. I have 4 arguments. That's 1048560B or 0,9999847412109375MB. With `Main` and methods above taking already some small piece of stack space we're over the default 1MB.

To be double sure, I can double the stack size (pun intended).

```csharp
var t = new Thread(() =>
{
    Console.WriteLine("Calling");
    Call();
    Console.WriteLine("Called");
}, 2 * 1024 * 1024);
t.Start();
t.Join();
```

And it executed just fine. I like when something works as expected.

#### Summary

You can cause stack overflow just by "regular" code in C#, plenty of options for that without hitting any limits (like for example [here][7]). But the code is very likely not going to be written completely by hand, because any sane developer would spot the number of fields (either in the `struct` or in general) is going nuts and it should probably be refactored.

Note: Be sure to be in _Release_ configuration (all optimizations turned on). Else you might see `System.InvalidProgramException: JIT Compiler encountered an internal limitation.`.

> [Part 2 of the story.][8]

[1]: https://www.wug.cz/zaznamy/322--NET-Memory-Internals-WinDbg
[2]: https://knowledge-base.havit.cz/author/roberthaken/
[3]: https://en.wikipedia.org/wiki/Call_stack
[4]: https://msdn.microsoft.com/en-us/library/system.stackoverflowexception%28v=vs.110%29.aspx
[5]: https://en.wikipedia.org/wiki/Just-in-time_compilation
[6]: https://msdn.microsoft.com/en-us/library/x7sk421w.aspx
[7]: {{ include "post_link" 233553 }}
[8]: {{ include "post_link" 233611 }}