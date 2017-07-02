---
title: |-
  Head- and Tail-like methods in C# (and F# and Python and Haskell)
date: 2017-06-27T05:26:00Z
tags:
  - C#
  - F#
  - Python
  - Haskell
  - Functional programming
---
While writing [previous post][1] I realized the deconstruction to tuple can be added to any type. As far as compiler is concerned the `Deconstruct` method needs to exist, doesn't matter whether it's an extension method or instance one. That means I can write a `Head`- and `Tail`-like methods in C# with nice syntax. I also dusted off my Haskell knowledge and wrote the same logic there for comparison. And then I did it in Python and F# as well. Brace yourself for a true polyglot post.

<!-- excerpt -->

#### Deconstruction in C#

To support deconstruction to tuple, C# compiler is looking for a `void Deconstruct(out T1 out1, out T2 out2, ...)` method. As I said it doesn't need to be instance method, extension method will do.

For example, imagine classic `Point` class with `X` and `Y` properties. Then the method could be `void Deconstruct(out int x, out int y)`.

#### Head and Tail for List<T> in C#

The `Head` method returns first element in the list, which is easy to do thanks to `FirstOrDefault` LINQ method. The `Tail` method returns the remaining. Although you can modify the list itself and return it back, I consider it bad practice and rather decided to construct a new one.

```csharp
static void Deconstruct<T>(this List<T> list, out T head, out List<T> tail)
{
	head = list.FirstOrDefault();
	tail = new List<T>(list.Skip(1));
}
```

Fairly easy. With that in place I can write an infamous `Sum` function to sum the items in the list.

```csharp
int Sum(List<int> list)
{
	switch (list.Count)
	{
		case 0:
			return 0;
		default:
			var (head, tail) = list;
			return head + Sum(tail);
	}
}
```

Bit too much noise around, but what you can do...

Just to make sure it works.

```csharp
static void Main(string[] args)
{
	var list = new List<int>() { 10, 20, 100 };
	Console.WriteLine(Sum(list));
}
```

#### What about F#

F#, being functional language, has a great support for pattern matching and hence I expected fairly succinct code.

```fsharp
open System

let rec sum list =
   match list with
   | head :: tail -> head + sum tail
   | [] -> 0

[<EntryPoint>]
let main argv = 
    let list = [10; 20; 100]
    Console.WriteLine(sum list)
    0
```

Not bad.

#### What about Python

Python is not a first-class functional language, although some syntax/features, especially for tuples, I like.

```python
def sum(list):
	if len(list) == 0:
		return 0;
	else:
		head, *tail = list	
		return head + sum(tail)

list = [10, 20, 100]
print(sum(list))
```

I'd say, about as good as in C#. Notable piece is the `head, *tail = list` where I'm using the "Extended Iterable Unpacking" ([PEP 3132][2]). Also, if you don't like the `if len(list) == 0`, you can use `if not list`, which some argue is more Pythonic.

#### What about Haskell

Last time I used Haskell for anything real was when I was at university. Thus, when I saw the `Prelude>` it brought back some memories. 

```haskell
module Main(main) where 

list = [10,20,100]

sum :: [Int] -> Int
sum [] = 0
sum xs = head xs + Main.sum (tail xs)

main =
	print (Main.sum list)
```

Umm. Although it's using the `head` and `tail` functions it doesn't feel like idiomatic Haskell. After some research, I remembered there is a pattern matching on lists directly.

```haskell
sum :: [Int] -> Int
sum (x:xs) = x + Main.sum xs
sum _ = 0
```
This feels more like Haskell I remember. It's also _very_ pleasant to read, don't you think?

I want to spend more time in this language. And quick googling shows [it might be possible to even interact with .NET][3].

#### The end

I was trying to recall where I've got the idea for `Head`- and `Tail`-like methods in C#, but my memory failed me. Never mind. It was fun anyway. Especially checking other languages. And especially Haskell. I'm definitely going to explore `hs-dotnet` more one day.

[1]: {% include post_link, id: "233632" %}
[2]: https://www.python.org/dev/peps/pep-3132/
[3]: https://hackage.haskell.org/package/hs-dotnet