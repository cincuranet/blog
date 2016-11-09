---
title: "Explicit default access modifiers?"
date: 2010-10-22T08:46:02Z
tags:
  - C#
  - Programming in general
layout: post
---
Few months ago [Miguel de Icaza][1] posted on Twitter message about explicitly stating your member private access modifier (or anything that's default) and that he doesn't understand it, the he wants his code be succinct.

```csharp
class Foo
{
	private int _bar;
	// or?
	int _bar;
}
```

I, as a lot of other people, replied, that I want to be explicit about my code. Tell exactly what I want. However I had a sneaking idea in my brain since this message - because I like my code, my thoughts in code, to be succinct - and I decided give it a try. I removed all the explicit access modifiers that are actually default from [ID3 renamer][2]'s code base a start. Well, after working with it some time, I didn't noticed anything confusing. There's only couple of default rules, so it's not like you would need to learn a lot of new stuff. And, for me, because there's less text in source code, it looks more readable for me, especially if I'm just checking something out using notepad-like (no highlighting) viewer.

I'm now following this "rule" for every new code I'm writing. I like it when I spin my head around something that looks completely useless to think about, for a first sight, but later shows up to be a good idea or true.

[1]: http://twitter.com/migueldeicaza
[2]: http://www.id3renamer.com