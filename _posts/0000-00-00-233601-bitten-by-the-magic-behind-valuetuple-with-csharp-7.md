---
title: |-
  Bitten by the magic behind ValueTuple with C# 7
date: 2017-03-15T06:00:00Z
tags:
  - .NET
  - .NET Core
  - C#
  - Roslyn
layout: post
---
I've had some spare time in between working on other items yesterday and I decided to explore how the [_FbNetExternalEngine_ plugin][3] would feel with new [tuples support in C# 7][2]. As it happens the sailing was not smooth and I was bitten by the magic the compiler does for us.

<!-- excerpt -->

I'll not explain the tuples feature, it's described well in the above linked post on .NET Blog. Instead let's start with the code right away.

![Tuples in C# 7]({% include post_i_link.txt post=page name="value_tuple.png" %})

Ignore the red squiggles for a minute and focus in the code instead. I created simple `OhMy` method that returns the tuple. Of course, using the new syntax. The syntax is something compiler brings, but the types behind are from a [_System.ValueTuple_][1] NuGet package with identically named types (thus you can use it in C# 6, minus the fancy syntax). The tuples can (and should) have named fields, however I'm not using it in this piece of code. I'm just accessing the `ItemX` fields directly. The `Item10` in the example.

If you're like me, you're thinking: "Wow, interesting.". The compiler is probably generating some types in background, because clearly there's only finite set of `ValueTuple<T1..Tn>` you can have in the referenced assembly. Right? Then, obviously, the question is, why is there the referenced assembly in the first place? Compiler might generate even the most common ones...

Nope. The compiler is not generating anything in this case. It's doing the same trick with 8th `TRest` item as we were forced to do with [regular (reference) `Tuple`][4]. The code we see is just a nice facade on top of that.

![Magic behind Item10]({% include post_i_link.txt post=page name="value_tuple_2.png" %})

Looking at the IL code it's clearly visible. It's accessing the `Rest` and then `Item3`. Because the `ValueTuple` goes only to 8 generic items. That also explains the weird error messages about ``System.ValueType`3`` and ``System.ValueType`8`` on the first picture.

Why does this even matter? In my case in _FbNetExternalEngine_ I'm fetching the values the callee returned using reflection (currently). Although in the code I can use the `Item10` (for example) and it looks like a regular field, the reflection code will not be able to find such field.

It makes perfect sense, given the behavior I described above. It's just something that looks like it's straightforward, but it isn't. It makes me kind of sad. Or maybe it is because last two days I spent beating my head with race conditions and isolation levels in databases, and my brain is beaten and I just wanted something straightforward. Anyway, good to know.  

[1]: https://www.nuget.org/packages/System.ValueTuple/
[2]: https://blogs.msdn.microsoft.com/dotnet/2017/03/09/new-features-in-c-7-0/
[3]: {% include post_id_link.txt id="233566" %}
[4]: https://msdn.microsoft.com/en-us/library/system.tuple%28v=vs.110%29.aspx