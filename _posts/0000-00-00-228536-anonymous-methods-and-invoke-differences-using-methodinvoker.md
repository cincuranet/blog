---
title: |-
  Anonymous methods and Invoke - differences using MethodInvoker
date: 2008-10-22T18:34:00Z
tags:
  - .NET
---
OK, let's start with some off topic paragraph. If you wanna to operate with some UI stuff from thread, you have to "push" the method processing into the UI thread. With .NET FW 2.0 and higher you can use [SynchronizationContext][1] class and let "the right" :) side to handle this. On the other hand, the classic (or older if you want) approach is to use Invoke method on some control, mainly Form (the problem here is, that the method have to know that's called from thread - but it's solvable too). 

The problem with Invoke is, that when you put delegate as anonymous method there, it will not compile. Something like:

```csharp
this.Invoke(delegate { button1.Text = DateTime.Now.ToLongTimeString(); });
```

So you can create your own delegates ("normal" delegates) and continue without any problem. But there's a handy class called `MethodInvoker`. With it you can call anonymous methods without creating own delegates.

But you can find couple of articles, using two different syntax. One looks:

```csharp
this.Invoke(new MethodInvoker(delegate { button1.Text = DateTime.Now.ToLongTimeString(); }));
```

and other:

```csharp
this.Invoke((MethodInvoker)delegate { button1.Text = DateTime.Now.ToLongTimeString(); });
```

Both works like a charm. But is there any difference? Well to find out, you can do long thoughts, but the fastest way is take `ildasm` tool and grab compiled IL. Without long talking, look at results:

```text
.method private hidebysig instance void  button1_Click(object sender,
                                                       class [mscorlib]System.EventArgs e) cil managed
{
  // Code size       21 (0x15)
  .maxstack  8
  IL_0000:  nop
  IL_0001:  ldarg.0
  IL_0002:  ldarg.0
  IL_0003:  ldftn      instance void WindowsFormsApplication1.Form1::'<button1_click>b__0'()
  IL_0009:  newobj     instance void [System.Windows.Forms]System.Windows.Forms.MethodInvoker::.ctor(object,
                                                                                                     native int)
  IL_000e:  call       instance object [System.Windows.Forms]System.Windows.Forms.Control::Invoke(class [mscorlib]System.Delegate)
  IL_0013:  pop
  IL_0014:  ret
} // end of method Form1::button1_Click
```

```text
.method private hidebysig instance void  button1_Click(object sender,
                                                       class [mscorlib]System.EventArgs e) cil managed
{
  // Code size       21 (0x15)
  .maxstack  8
  IL_0000:  nop
  IL_0001:  ldarg.0
  IL_0002:  ldarg.0
  IL_0003:  ldftn      instance void WindowsFormsApplication1.Form1::'<button1_click>b__0'()
  IL_0009:  newobj     instance void [System.Windows.Forms]System.Windows.Forms.MethodInvoker::.ctor(object,
                                                                                                     native int)
  IL_000e:  call       instance object [System.Windows.Forms]System.Windows.Forms.Control::Invoke(class [mscorlib]System.Delegate)
  IL_0013:  pop
  IL_0014:  ret
} // end of method Form1::button1_Click
```

No doubts, the code is same. :)

So what to use? I think it's question of personal preferences (and just to be consistent in whole code). OK, maybe the `new ...` makes little bit more sense, because the IL code contains constructor. But...

_What's your preference?_

[1]: {% include post_link id="8310" %}