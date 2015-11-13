---
title: "Removing explicit default access modifiers (Roslyn analyzer and codefix)"
date: 2015-11-13T04:27:00Z
tags:
  - C#
  - .NET
  - Roslyn
  - Visual Studio
redirect_from: /id/233535/
category: none
layout: post
---
This was really an enriching experience. Not only I finally understood better formatting and trivias in Roslyn, I also had to think about what my code looks like in general, which I thought I had clear in my head. Here's the full story.

<!-- excerpt -->

Probably as everybody, when I started programming in C# I followed what tools like Visual Studio did to my code. In particular the explicit default access modifiers. For example when you refactor a code into a new method, its signature becomes `private void FooBar()`. Nothing wrong. But then I started to like my code to be more succinct. Not obfuscated or unreadable. Just succinct (although the line between unreadable and succinct is very thin). Why would I have the `private` in the previous example? It's default anyway. It's just noise (I think).

So I started writing code without all this noise. And I like it. As a brain training I decided to write an analyzer and an codefix to detect these explicit default access modifiers. It seemed fairly straightforward. And I also wanted to try to write tests for both the analyzer and the codefix, because Visual Studio by default generates you project for tests with bunch of code, to learn how that's handled. And also I was bored in a hotel.

Interestingly as I was writing the very isolated tests I saw the code from different angle, I realized why people write i.e. the `private` keyword explicitly. It looks consistent. I like consistency. I like it a lot. For a moment I was questioning whether I really want to continue writing a code that removes "consistency".

Let me show you.

```csharp
class C
{
	public void Foo()
	{ }

	private void Bar()
	{ }
}
```


```csharp
class C
{
	public void Foo()
	{ }

	void Bar()
	{ }
}
```

See how in the first example the method declarations look consistent? The other example is not. Or is it? In these simple example it really does like it's inconsistent. But once you start adding other modifiers like `static`, `async` or simply `protected internal` it's back to inconsistent _look_. Good, back to coding.

For the analyzer the biggest challenge was to detect all the possible elements and defaults - you have classes, structs, interfaces, fields and events, properties, methods and constructors, delegates plus some could be nested. Should be it (let me know if not).

Although I spent significant amount of time, way more than I expected, on the codefix, at the end it's just a few lines of code. Handling trivias versus formatting was something new and I'm glad I grasped it. In this case I only needed to take the trivias (basically all the leading white characters) from the token being removed (and just the token itself) and merge it with the next token (and there's always going to be some). No need to worry with reformatting or anything like that.

You can find the code in [this repository][1]. PRs welcome. And if you want to use it, just add [`ExplicitDefaultAccessModifiersAnalyzer` NuGet package][2] to your projects.

[1]: https://github.com/cincuranet/ExplicitDefaultAccessModifiersAnalyzer
[2]: http://www.nuget.org/packages/ExplicitDefaultAccessModifiersAnalyzer