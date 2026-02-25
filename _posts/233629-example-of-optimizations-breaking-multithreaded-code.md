---
title: |-
  Example of optimizations "breaking" multithreaded code
date: 2017-06-11T12:58:00Z
tags:
  - .NET
  - .NET Core
  - C#
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
> I realized I have some pieces of code to show some specific behavior, mostly around threading and synchronization, all over my notes. Some of these pieces may be 10+ years old. I use these pieces during my "threading/parallel/async" course, but why not to share it publicly. Maybe I'll stumble on it after some years, maybe .NET will be history, and it will be interesting to re-read and re-think the code. The code isn't unique or something where I'm the first to realize it. It's really just an example code.

Today I have a small example that shows how optimizations (compiler, JIT, ...) can make multithreaded code behave differently than expected. I don't remember where I've seen the code. Some book or blog post from - I guess - [Jeffrey Richter][1]. Or maybe [Joe Duffy][2] or [Stephen Toub][3] or ... These guys are very smart.

<!-- excerpt -->

```csharp
static class Test
{
	static int stop = 0;

	static void Main()
	{
		var t = new Thread(Worker);
		t.Start();
		Console.WriteLine($"Running ({FrameworkVersion})");
		Thread.Sleep(5000);
		stop = 1;
		Console.WriteLine("Waiting");
		t.Join();
	}

	static void Worker(object o)
	{
		Console.WriteLine("Started");
		var x = 0;
		while (stop == 0)
			x++;
		Console.WriteLine("Stopped");
	}

	static string FrameworkVersion =>
#if NETCOREAPP1_1
	System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription;
#else
	Environment.Version.ToString();
#endif
}
```

The code is pretty straightforward. Separate thread is started executing `Worker` method where the `while` loop spins until the `stop` variable is set. This variable is set after 5 seconds in the main thread. Thus, one might expect the code to stop after 5 seconds. Surprisingly if you run this code with full optimizations (_Release_ build) and without debugger attached the loop in `Worker` method never stops. How is it possible? As I said above, the problem is the optimizations.

Let's have a look at what's actually being executed. The code differs slightly - although the end behavior is the same - whether it's running in 64bit or 32bit.

#### .NET Framework 4.0.30319.42000 in 32bit (MS x86 JIT)

```asm
			; while (stop == 0)
02820556  mov         eax,dword ptr ds:[00EF43CCh]
0282055B  test        eax,eax
0282055D  jne         02820563
0282055F  test        eax,eax
02820561  je          0282055F
```

Whoa. That's very well optimized. The `stop` variable is, first, loaded into `EAX` register and then used only from there in `test`-`je` loop which represents the `while` loop in code. It makes sense, the `stop` is never modified there, so why bother loading it from memory all the time.

It's also worth mentioning the `x` increment was optimized out, because it's not used at all. Changing the code to `Console.WriteLine($"Stopped ({x})");` gives us slightly different assembly.

```asm
			; var x = 0;
01480557  xor         esi,esi
			; while (stop == 0)
01480559  mov         eax,dword ptr ds:[010E43CCh]
0148055E  test        eax,eax
01480560  jne         01480567
				; x++;
01480562  inc         esi
			; while (stop == 0)
01480563  test        eax,eax
01480565  je          01480562
```

Although the assembly is slightly different now (the `x` variable is held in `ESI` register), the optimization is still there.

#### .NET Framework 4.0.30319.42000 in 64bit (_RyuJIT_)

```asm
			; var x = 0;
00007FF800440616  xor         ecx,ecx
			; while (stop == 0)
00007FF800440618  mov         eax,dword ptr [7FF80033476Ch]
00007FF80044061E  test        eax,eax
00007FF800440620  jne         00007FF800440628
				; x++;
00007FF800440622  inc         ecx
			; while (stop == 0)
00007FF800440624  test        eax,eax
00007FF800440626  je          00007FF800440622
```

The code is the same as in 32bit. Only the `x` was not completely eliminated, it's kept in `ECX` register, although never used. Hence the problem is still there, because the value is tested from register and never re-fetched from memory.

Using the `x` makes the code basically the same as in 32bit.

```asm
			; var x = 0;
00007FF80043062C  xor         esi,esi
			; while (stop == 0)
00007FF80043062E  mov         ecx,dword ptr [7FF80032476Ch]
00007FF800430634  test        ecx,ecx
00007FF800430636  jne         00007FF80043063E
				; x++;
00007FF800430638  inc         esi
			; while (stop == 0)
00007FF80043063A  test        ecx,ecx
00007FF80043063C  je          00007FF800430638
```

The `ECX` register is no longer used and `ESI` is used instead, because the message will use `x`.

#### .NET Core 4.6.25211.01 on 64bit (_RyuJIT_)

```asm
		; var x = 0;
00007FF7E4A410B7  xor         esi,esi
		; while (stop == 0)
00007FF7E4A410B9  mov         rcx,7FF7E48E4E90h
00007FF7E4A410C3  mov         edx,1
00007FF7E4A410C8  call        00007FF84453DE80
00007FF7E4A410CD  mov         ecx,dword ptr [7FF7E48E4EC4h]
00007FF7E4A410D3  test        ecx,ecx
00007FF7E4A410D5  jne         00007FF7E4A410DD
			; x++;
00007FF7E4A410D7  inc         esi
		; while (stop == 0)
00007FF7E4A410D9  test        ecx,ecx
00007FF7E4A410DB  je          00007FF7E4A410D7
```

No surprise here. Still the same optimization. It's very close to the assembly the .NET Framework on 64bit with `x` used produced.

You might also notice the `mov`-`mov`-`call` sequence there and wonder: Why it's there? What is doing? What's at `00007FF84453DE80`? You're not alone. I ask the same questions. But my current knowledge and skills can't give me answers. According to debugger there's no code at `0x00007FF86294DE80`. Maybe somebody reading this can shed some light on it.

#### Conclusion

Optimizations are great. The compiler or JIT or ... can make the code run much faster. But with a great tool comes also great change of injuring self. That's why it's so important to understand _memory barriers_ and _volatile_ and _locking_ and proactively looking for places where these need to be.

In this example, no matter .NET Framework or .NET Core or JIT the unexpected behavior happens. And even if it didn't in one case, one shouldn't rely on that and rather have the code correct.

[1]: https://twitter.com/jeffrichter
[2]: http://joeduffyblog.com/
[3]: https://github.com/stephentoub