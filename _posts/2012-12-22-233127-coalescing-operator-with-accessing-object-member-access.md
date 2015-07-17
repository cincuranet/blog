---
title: "Coalescing operator with accessing object member access"
date: 2012-12-22T17:33:08Z
tags:
  - .NET
  - C#
  - Programming in general
redirect_from: /id/233127/
category: none
layout: post
---
Few days back [Aleš Roubíček][1] wrote an interesting article about, basically, needless code. You can read it [here][2], though in Czech.

In one part he points to the coalescing operator `??` as being helpful while trying to write succinct code. And I agree. But also very often I need to not only coalesce the value itself, but, because we live with objects,  also access some member on the object itself. Small example.

```csharp
var d = DateTimeOrNull();
int? x;
if (d.HasValue)
x = ((DateTime)d).Minute;
else
x = null;
```

This pattern I find having in my code very often. But it's hard to write it succinctly. Yes, I can use ternary operator `?:`, but I still need to use intermediate variable. Boring. Having a language construct for this case would be interesting. Actually I wrote myself simple extension method for that, but that's not the same as having it baked into the language.

I can imagine something like this (just shooting some syntax).

```csharp
int? x = DateTimeOrNull() ? x => x.Minute ?? null;
```

Or am I only one thinking/bothering about this? :)

[1]: http://rarous.net
[2]: http://rarous.net/weblog/361-nepiste-zbytecny-kod.aspx