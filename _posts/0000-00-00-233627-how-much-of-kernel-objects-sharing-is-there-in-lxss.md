---
title: |-
  How much of objects sharing is there in LXSS?
date: 2017-06-02T07:20:00Z
tags:
  - .NET Core
  - LXSS
  - Windows
---
I'm playing a little with Windows Subsystem for Linux (also known as WSL or LXSS), mostly to see what's what and how it might be useful for my everyday usage. As I was reading some articles on how it's implemented and how it works inside I've got an idea. What if I create an application, in .NET Core, that uses some resource from kernel and I execute it both regular Windows session and in LXSS, will this resource be shared across?

<!-- excerpt -->

My initial idea was to use [`MemoryMappedFile`][1], which is available on .NET Core, and share some data between the two instances. As it turned out named version without an explicit backing file is not supported on Linux (which is quite understandable), so I had to unleash plan B.

Another resource that came to my mind was my favorite synchronization primitive - the [`Semaphore`][2]. Again, named one can't be created (currently) on Linux. I was starting to lose my hope. `Semaphore` aside, let's try [`Mutex`][3]. `Mutex` should work. It's such a common primitive. And indeed, it works. Time for some fun.

#### "Global" vs "local"

I created two instances, one with `Global\` prefix and one without. The `Global\` prefix makes the instance visible to all sessions on that machine, while the one without (or using `Local\`) is visible only in session where the application is running. Although this is Windows thing, I wanted to see if it makes any difference under LXSS.

#### Code

The code itself is pretty simple, because I just need to create the instance and check the `createdNew` `out` parameter to see what's what.

```csharp
Console.WriteLine("Global");
var m1 = new Mutex(true, @"Global\lxss", out var createdNew1);
Console.WriteLine(createdNew1);
Console.WriteLine("Local");
var m2 = new Mutex(true, @"lxss", out var createdNew2);
Console.WriteLine(createdNew2);
```

Now it's time to run it. 

#### Both application instances in Windows session

This run is nothing special in respect to LXSS. It's an expected result of first run returning `True` in both instance and other run returning `False` in both instances.

#### Both application instances in LXSS

This execution is slightly more interesting. The first run returns `True` in both instances, as expected. The other run returns `False` for _global_ and `True` for _local_ prefix. It means from outside view that every "Bash window" acts like a separate session and only if you use the `Global\` prefix you can see across sessions.

#### First instance in LXSS, other in Windows session

Now the big fun. How is it going to interact between LXSS and Windows session? Obviously the first run (in LXSS) returns `True` in both instances. Other run in Windows session returns `True` in both instances as well. Thus, LXSS is completely isolated from Windows session. The objects aren't available across Windows session and LXSS. It would be hyper-interesting if it would work like that (and I can imagine the magnitude of work for such behavior (very likely it would have to be case by case mapping for same objects)).

#### First instance in Windows session, other in LXSS

I was expecting this to behave the same way as the previous case, because it would be weird otherwise. But to be sure, I tested it. No surprise. It is as expected.

#### Final thoughts

If the kernel objects sharing would work it would be extremely interesting (from engineering point of view). But given the LXSS is targeted (currently) for developers and power users to bridge the gap for great tools not existing on Windows, I can absolutely see this isn't something the LXSS team would - probably ever - focus on.

[1]: https://msdn.microsoft.com/en-us/library/system.io.memorymappedfiles.memorymappedfile(v=vs.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/system.threading.semaphore(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/system.threading.mutex(v=vs.110).aspx