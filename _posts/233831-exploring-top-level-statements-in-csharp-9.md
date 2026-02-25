---
title: |-
  Exploring top-level statements in C# 9
date: 2020-06-11T05:30:00Z
tags:
  - Roslyn
  - C#
---
I wanted to know how is the top-level statements feature in C# 9 handled and what's actually produced. Although I originally planned to do just a quick test and the look at the IL, I kept testing the feature more and more.

<!-- excerpt -->

#### Elementary

I started with the simplest code to see what's what.

```csharp
using System;

Console.WriteLine("Test");
```

This results in fairly uncomplicated code.

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static void $Main(string[] args)
    {
        Console.WriteLine("Test");
    }
}
```

#### Explore

Can I return an exit code?

```csharp
using System;

Console.WriteLine("Test");
return 1;
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static int $Main(string[] args)
    {
        Console.WriteLine("Test");
        return 1;
    }
}
```

Looks like I can. Hmm. Can I use `async`/`await`?

```csharp
using System.Threading.Tasks;

await Task.CompletedTask;
return 1;
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    // async state machine omitted
    
    [AsyncStateMachine(typeof(<$Main>d__0))]
    private static Task<int> $Main(string[] args)
    {
        <$Main>d__0 stateMachine = default(<$Main>d__0);
        stateMachine.<>t__builder = AsyncTaskMethodBuilder<int>.Create();
        stateMachine.<>1__state = -1;
        stateMachine.<>t__builder.Start(ref stateMachine);
        return stateMachine.<>t__builder.Task;
    }

    private static int <Main>(string[] args)
    {
        return $Main(args).GetAwaiter().GetResult();
    }
}
```

OK, OK, that's expected. But still nice that I'm not limited (yet) in what I can do with this feature. Or maybe I am?

What about local functions?

```csharp
using System;

Test();

void Test()
{
    void Test2()
    {
    }    
    Console.WriteLine("Test");
    Test2();
}
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static void $Main(string[] args)
    {
        <$Main>g__Test|0_0();
    }

    internal static void <$Main>g__Test|0_0()
    {
        Console.WriteLine("Test");
        <$Main>g__Test2|0_1();
    }

    internal static void <$Main>g__Test2|0_1()
    {
    }
}
```

Nothing special. As "normal" local functions, these are just expanded into the class. Aah, class! Is it going to be nested or not?

```csharp
using System;

Console.WriteLine(new Test());

class Test
{ }
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static void $Main(string[] args)
    {
        Console.WriteLine(new Test());
    }
}

internal class Test
{
}
```

Ah. Makes sense, not nested. That would create unnecessary complication with naming. What about variables?

```csharp
using System;

var i = DateTime.UtcNow.Add(TimeSpan.FromSeconds(1));
Console.WriteLine(i);
Test();

void Test()
{
    Console.WriteLine(i);
}
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    [StructLayout(LayoutKind.Auto)]
    private struct <>c__DisplayClass0_0
    {
        public DateTime i;
    }

    private static void $Main(string[] args)
    {
        <>c__DisplayClass0_0 <>c__DisplayClass0_ = default(<>c__DisplayClass0_0);
        <>c__DisplayClass0_.i = DateTime.UtcNow.Add(TimeSpan.FromSeconds(1.0));
        Console.WriteLine(<>c__DisplayClass0_.i);
        <$Main>g__Test|0_0(ref <>c__DisplayClass0_);
    }

    internal static void <$Main>g__Test|0_0(ref <>c__DisplayClass0_0 P_0)
    {
        Console.WriteLine(P_0.i);
    }
}
```

Finally! Something interesting. The compiler is not creating instance field as I was expecting (and trying to force it), but it's creating a `struct` (a _value type_) instead and passing it around using `ref`.

What about some `unsafe` code? Let's start with "safe"-ish `Span<T>`.

```csharp
using System;

Span<long> longs = stackalloc long[10];
Console.WriteLine(longs.IsEmpty);
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static void $Main(string[] args)
    {
        Console.WriteLine(stackalloc long[10].IsEmpty);
    }
}
```

Let's switch to really unsafe code.

```csharp
using System;

long* longs = stackalloc long[10];
```

This fails with error `Pointers and fixed size buffers may only be used in an unsafe context` aka `CS0214`. OK, looks like the compiler will not generate `unsafe` `Main`. But will it be OK if I create my own `unsafe` method?

```csharp
using System;

Test();

unsafe void Test()
{
    fixed (char* value = "safe")  
    {  
      char* ptr = value;  
      while (*ptr != '\0')  
      {  
         Console.WriteLine(*ptr);  
         ++ptr;  
      }  
    }   
}
```

```csharp
[CompilerGenerated]
internal static class $Program
{
    private static void $Main(string[] args)
    {
        <$Main>g__Test|0_0();
    }

    internal unsafe static void <$Main>g__Test|0_0()
    {
        fixed (char* ptr = &"safe".GetPinnableReference())
        {
            for (char* ptr2 = ptr; *ptr2 != 0; ptr2++)
            {
                Console.WriteLine(*ptr2);
            }
        }
    }
}
```

It will. Nice.

I think that's enough playing.

#### Summary

I like how the compiler uses `struct` and `ref` passing to handle "global"/"instance" variables. That's smart.

Although it looks like a small feature with almost like a "just take this code and smack it into generated `Main`", it's not that easy. There's a lot of features in C# one can use. Luckily most of the features one can seamlessly use while using top-level statements. 