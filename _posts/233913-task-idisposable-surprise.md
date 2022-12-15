---
title: |-
  Task<IDisposable> surprise
date: 2022-12-15T08:00:00Z
tags:
  - .NET
  - C#
---
This combination of `Task` and `IDisposable` surprised me quite well. And yes, it's my fault. As usual.

<!-- excerpt -->

I was writing a simple asynchronous method that returns an object that implements `IDisposable`. Really barebones example.

```csharp
async Task<IDisposable> Foo()
{
    return default;
}
```

And then I used this method like this. Nothing to talk about. Or?

```csharp
using (Foo())
{
}
```

Can you see the problem? No? Neither did I. With this call, I'm disposing the _task_ (`Task` also implements `IDisposable`) that I just started/received, not the _disposable_ itself.

The correct code is like this.

```csharp
using (await Foo())
{
}
```

Which I've found after I deployed an application to my Raspberry Pi and it failed. I suppose that qualifies me for "testing in production guy" label. 8-)

And now, forever, I'll remember it and I'll be carefull around this combination. And maybe you'll too.
