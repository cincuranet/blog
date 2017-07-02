---
title: |-
  Inducing "regular" stack overflow exception - part 2
date: 2017-04-08T10:22:00Z
tags:
  - .NET
  - C#
---
During, literally, writing yesterday's [Inducing "regular" stack overflow exception][1] I got an idea to try to induce the stack overflow using methods only, no arguments, and still without recursion. Can I do it? Am I going to hit some limits? Would I learn something new (as I did in "part 1")? Yes, yes and yes.

<!-- excerpt -->

#### Idea

Let's jump directly into coding, because the basics were already covered in [previous part][1]. The task is pretty simple. I need to generate class with methods, where each method will call the next one (or the previous one). There's probably going to be some limit on the number of methods, but let's blindly try it.

#### Code

It didn't take long and I knew there's a limit. Again it looked like it's around 65535, but not exactly 65535. We'll explore that later. Let's just say that for static `class` the limit is 65521 and for instance `class` it is 65520. Learning something new!

Because I was too lazy to compute exact number of methods, I just generated enough classes - enough in a way 1MB/4B best case scenario - and I went to compile the code, which took some time. Executing it, surprisingly, didn't end up in stack overflow. Probably not enough methods. I added another batch of ~64k-ish methods and tried again. Nothing. Bummer.

My guess was that some optimization is breaking it. But is it a compiler itself or a JIT? I just hope it's not the JIT. I don't wanna spend Saturday in assembly. Because the methods are so simple and just calling further and further I took a leap of faith and concluded it's something like tail-call optimization or inlining. I added some code before and after the calls to quickly test it. And it worked! I'm moving.

Let's try disabling inlining first, because that's easy. You add [`MethodImpl(MethodImplOptions.NoInlining)` attribute][3] and that's it. You can also force inlining, by the way (make sure you know what you're doing).

The final template for generating the code looked like this.

```text
<#@ template debug="false" hostspecific="false" language="C#" #>
<#@ output extension=".cs" #>

<#
    const int MaxMethods = 65521;
    const int MaxClasses = 2;
#>
using System.Runtime.CompilerServices;
using static System.Console;
<# for (var i = 0; i < MaxClasses; i++) {#>
static class Program<#=i#>
{
<# for (var j = 0; j < MaxMethods; j++) {#>
    [MethodImpl(MethodImplOptions.NoInlining)]
    public static void Test<#=j#>()
    {
<#
    if (j == MaxMethods-1) {
        if (i != MaxClasses-1) {
#>
        Program<#=i+1#>.Test0();
<#
        }
        else {
#>
        WriteLine("This is the end.");
<#
        }
    }
    else {
#>
        Program<#=i#>.Test<#=j+1#>();
<#
    }
#>
    }
<#}#>
}
<#}#>
```

Running `Program0.Test0` from the code above ends in stack overflow. Good. Another, maybe more expected way, to induce stack overflow.

#### Numbers

But, what's actually the number of calls? Adding a simple counter stops it at 128441. Doing simple math and one can conclude that in this scenario function call needs 8B. My functions don't have any arguments or local variables so that's out. What else needs to be stored? 4B are taken by the return address pushed by `call` and another 4B for saving `ebp` register. Who said assembly knowledge is useless in .NET world? ;) A small warning. These numbers are absolutely depending on a compiler (in case of .NET the JIT compiler) and architecture. It might be different on different CPU architecture and/or different compiler (there are even stack-less compilers/languages).

Finally, what's with the 65521 or 65520 respectively being limit on number of methods? Why not 65535 exactly? The [answer][4] is in separate post, because it needs some longer thinking.

#### Summary

There you have it. Another "regular" C# code that induced stack overflow. This one maybe even little bit more realistic than the previous one. Still nothing that would happen easily by any means.

[1]: {% include post_link, id: "233610" %}
[2]: https://en.wikipedia.org/wiki/Tail_call
[3]: https://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.methodimplattribute%28v=vs.110%29.aspx
[4]: {% include post_link, id: "233613" %}