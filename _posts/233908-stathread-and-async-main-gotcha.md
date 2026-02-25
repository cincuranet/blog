---
title: |-
  STAThread and async Main gotcha
date: 2022-11-15T08:00:00Z
tags:
  - C#
  - WinForms
  - .NET
---
This took me quite a while to debug, because I was constantly wrongly assuming my threading and synchronization context handling was wrong. At the end of the day it was very simple, I just couldn't see the forest for the trees.

<!-- excerpt -->

I have a gutted out WinForms application, no forms, just manually handling bunch of stuff via `ApplicationContext`. For example, something like this.

```csharp
[STAThread]
static void Main()
{
	ApplicationConfiguration.Initialize();
	Application.Run(new MyApplicationContext());
}
```

Which is pretty standard. But at one point I had to do some "asynchronous initialization" and switched to this (again, an example).

```csharp
[STAThread]
static async Task Main()
{
	ApplicationConfiguration.Initialize();
	await foo.InitializeAsync();
	Application.Run(new MyApplicationContext());
}
```

And suddenly everything started to fell apart. I.e: `System.Threading.ThreadStateException: 'Current thread must be set to single thread apartment (STA) mode before OLE calls can be made. Ensure that your Main function has STAThreadAttribute marked on it.'`. 

As I mentioned at the beginning, I immediately jumped into conclusion, that I'm doing something wrong regarding my threading and synchronization context. But as I was digging into it, everything seemed correct. But I kept digging. Oh, boy. Luckily, I realized what the issue was.

The _async Main_ is no magic. In fact [I blogged about it][1] roughly 5 years ago. The end code is more or less this.

```csharp
static void Main() => OldMain().GetAwaiter().GetResult();

[STAThread]
static async Task OldMain()
{
	ApplicationConfiguration.Initialize();
	await Foo.InitializeAsync();
	Application.Run(new MyApplicationContext());
}
```

Now the `STAThread` attribute is no longer on real `Main`, but on some "random" method.

With that, I simply manually created `Main` method that would be otherwise created by compiler and put `STAThread` attribute there.

Job done. But what a journey!

[1]: {{ include "post_link" 233656 }}
