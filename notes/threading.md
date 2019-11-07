---
title: Threading notes
no_page: true
layout: page
---
#### Context switch

There is actually quite little you can do in software to improve the overhead of context switches. Most of the overhead is hardware related. Sure you can tweak the code that stores/restores registers, performs scheduling, and stuff, but in the grand scheme of things hardware overhead dominates (I'll substantiate that below). Using the x86 as an example architecture:

Assuming the context switch is initiated by an interrupt, the overhead of switching from user-level to kernel-level on a (2.8 GHz) P4 is 1348 cycles, on a (200 MHz) P2 227 cycles. Why the big cycle difference? It seems like the P4 flushes its micro-op cache as part of handling an interrupt (go to arstechnica.com for some details on the micro-op cache). Counting actual time, the P4 takes 481 ns and the P2 1335 ns.

The return from kernel-level to user-level will cost you 923 cycles (330 ns) on a P4, 180 cycles (900 ns) on a P2.

The overhead of storing / restoring registers (not counting any TLB overhead / excluding cost of FPU register store / restore) is 188 cycles on the P4 (67 ns), 79 cycles on the P2 (395 ns).

A context switch also includes the overhead of switching address spaces (if we're switching between processes, not threads). The minimal cost of switching between two address spaces (counting a minimal TLB reload of 1 code page, 1 data page, and 1 stack page) is 516 cycles on a P4 (184 ns) and 177 cycles on a P3 (885 ns).

So the equation is (for a P4):

811 ns (HW) + 184 ns (HW: address space switch) + 67 ns (register store / restore) + ?? (scheduling overhead) = cost of context switch.

That'll leave you with 995 ns of HW overhead. You can spend as much as 2598 cycles in the scheduler before SW overhead dominates.

So, measured in actual time the cost of context switches is declining (P2: 3120 ns vs. P4: 995 ns - 3:1). But looking at CPU clock speed differences (P2: 200 MHz vs P4: 2800 MHz - 1:14), one can only conclude that the cost of context switches is rising.

And yes, I used some home-grown software to perform these measurements.

#### Memory fence

A full fence takes around ten nanoseconds on a 2010-era desktop.

The following implicitly generate full fences:

* C#'s lock statement (Monitor.Enter/Monitor.Exit)
* All methods on the Interlocked class (we'll cover these soon)
* Asynchronous callbacks that use the thread pool - these include asynchronous delegates, APM callbacks, and Task continuations
* Setting and waiting on a signaling construct
* Anything that relies on signaling, such as starting or waiting on a Task

By virtue of that last point, the following is thread-safe:

```csharp
int x = 0;
Task t = Task.Factory.StartNew (() => x++);
t.Wait();
Console.WriteLine (x);    // 1
```

#### Thread

```text
TKO => x86 ~700b; x64 ~1240b; IA64 ~2500b
TEB => 4 KB on x86 and x64 CPUs, 8 KB on an IA64 CPU
Kernel Mode Stack => 12kB x86; 24kB x64
```

#### Out of program order

```csharp
class OutOfProgramOrder 
{ 
	private Int32 m_flag = 0; 
	private Int32 m_value = 0;

	public void Thread1() 
	{ 
		m_value = 5; 
		m_flag = 1; 
	}

	public void Thread2() 
	{ 
		if (m_flag == 1) 
			Display(m_value); // 0! 
	}
}
```

```csharp
class OutOfProgramOrder 
{ 
	private Int32 m_flag = 0; 
	private Int32 m_value = 0;

	public void Thread1() 
	{ 
		m_value = 5; 
		Thread.VolatileWrite(ref m_flag, 1); 
	}
	
	public void Thread2() 
	{ 
		if (Thread.VolatileRead(ref m_flag) == 1) 
			Display(m_value); // nothing or 5!
	}
}
```

#### Transistor

22nm => 50 silicon atoms

#### Scheduling timeslices

* Windows
	* 10-120ms (when quanta can vary, has one of 2 values)
	* reentrant and preemptible
* Linux
	* 10-200ms, default is 100ms (varies across entire range based on priority, which is based on interactivity level)
	* reentrant and preemptible

#### Crazy async/await

```csharp
using System;
using System.Runtime.CompilerServices;

public class var
{
	async async async(async async) => await async;
}

[AsyncMethodBuilder(typeof(builder))]
class async
{
	public awaiter GetAwaiter() => throw null;
}
class await
{
	public awaiter GetAwaiter() => throw null;
}

class awaiter : INotifyCompletion
{
	public bool IsCompleted => true;
	public void GetResult() { }
	public void OnCompleted(Action continuation) { }
}

class builder
{
	public builder() { }
	public static builder Create() => throw null;
	public void SetResult() { }
	public void SetException(Exception e) { }
	public void Start<TStateMachine>(ref TStateMachine stateMachine) where TStateMachine : IAsyncStateMachine => throw null;
	public async Task => throw null;
	public void AwaitOnCompleted<TAwaiter, TStateMachine>(ref TAwaiter awaiter, ref TStateMachine stateMachine) where TAwaiter : INotifyCompletion where TStateMachine : IAsyncStateMachine => throw null;
	public void AwaitUnsafeOnCompleted<TAwaiter, TStateMachine>(ref TAwaiter awaiter, ref TStateMachine stateMachine) where TAwaiter : ICriticalNotifyCompletion where TStateMachine : IAsyncStateMachine => throw null;
	public void SetStateMachine(IAsyncStateMachine stateMachine) => throw null;
}
```

#### Links

* [this]({% include post_link, id: "233433" %})
* [this]({% include post_link, id: "233629" %})
* [this]({% include post_link, id: "233626" %}) 
* [this]({% include post_link, id: "233735" %})