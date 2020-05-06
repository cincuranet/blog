---
title: |-
  Step into a specific call when debugging in Visual Studio
date: 2018-09-24T19:17:00Z
tags:
  - Visual Studio
  - Keyboard
---
Last week, as we were wrapping the first day of [.NET Developer Days conference][1], I was sitting in the "Ask The Expert" area ~~quietly by myself, reading the poems, waiting for questions~~ with [Kendra Havens][2] chatting about Visual Studio shortcuts and [enjoying the pre-party beer][3]. As it turned out, there's one super handy shortcut for debugging that most people - Kendra included ;) - are not aware of (and which I wasn't able to cover in my 60 minutes of allotted time). Thus, I must spread the word.

<!-- excerpt -->

[![Me having a beer with Kendra Havens]({{ include "post_ilink" page "twitter_kendra_beer_thumb.jpg" }})]({{ include "post_ilink" page "twitter_kendra_beer.jpg" }})

Let's imagine you have this code.

```csharp
static void Main(string[] args)
{
	Foo(Bar(), Baz());
}

static void Foo(int a, int b)
{ }

static int Bar() => 1;

static int Baz() => 2;
```

And the debugger is on the `Foo(Bar(), Baz())` statement. Now if you want to step into `Foo` function, you probably press `F11` (please don't say you'd use the button on the toolbar...). But that will jump into the `Bar` function. If you're bit shortcut-geeky, you'd press `Shift-F11` to jump out of it and then continue doing the same with `Baz`. Not bad. But there's a better way.

Let's enter `Alt-Shift-F11` world. Pressing this key combination is going to give you menu (at the location where your mouse is) with functions (or properties, etc.) that you can step into (in the order of calling) and you can directly select (using arrow keys, obviously ;)) the function you're interested in, skipping the rest.

![Alt-Shift-F11 menu]({{ include "post_ilink" page "debugging_menu.png" }}) 

Isn't that great little hidden nugget? I use that quite often and it saved me plenty of time, especially when the calls are nested a lot (which I consider fine if it doesn't hurt readability). Did you know about it? Let me know in the comments.

[1]: {{ include "post_link" 233736 }}
[2]: https://twitter.com/gotheap
[3]: https://twitter.com/gotheap/status/1042064995528392704