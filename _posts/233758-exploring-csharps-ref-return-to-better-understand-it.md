---
title: |-
  Exploring C#'s ref return to better understand it
date: 2018-12-05T07:57:00Z
tags:
  - Roslyn
  - C#
  - .NET Core
  - .NET
  - RyuJIT
---
I felt a bit fuzzy on the topic of [_ref returns_ in C#][1]. I used it intuitively few times, but it felt I needed to fill some gaps and play with it in a little bit more structured way. This is my exploration of the topic. No particular order. No deep explanations. Just my thinking what should work and what not and trying it.

<!-- excerpt -->

I'm gonna use this simple `struct` (no reason, I just started with it and then for the convenience sake added the _implicit operator_).

```csharp
struct MyStruct
{
	public int I;

	public static implicit operator MyStruct(int i) => new MyStruct() { I = i };
}
```

#### #1

```csharp
class Test1
{
	MyStruct[] V = new MyStruct[] { 1, 2, 3, 4 };

	public ref MyStruct FooBar(int index)
	{
		return ref V[index];
	}
}
```

Works. The `V` is allocated on the heap and hence I can return a reference to some particular element.

#### #2

```csharp
class Test2
{
	public ref MyStruct FooBar(int index)
	{
		var v = new MyStruct[] { 1, 2, 3, 4 };
		return ref v[index];
	}
}
```

Works. Even though the `v` is local variable, it's not on stack because it's an array.

That means this should not work...

```csharp
class Test2_1
{
	public ref MyStruct FooBar(int index)
	{
		ref var x1 = new MyStruct();
		ref var x2 = ref new MyStruct();
		return ref x1;
	}
}
```

And it doesn't. The `x1` and `x2` fails with `error CS8172: Cannot initialize a by-reference variable with a value` and `error CS1510: A ref or out value must be an assignable variable` respectively.

What about `static` values...

```csharp
class Test2_2
{
	static MyStruct i;

	public ref MyStruct FooBar(int index)
	{
		return ref i;
	}
}
```

Works. Basically same as #1.

What if I remove the `static`...

```csharp
class Test2_3
{
	MyStruct i;

	public ref MyStruct FooBar(int index)
	{
		return ref i;
	}
}
```

Works. Because it's a field in a class and class is a reference type.

Should fail in `struct` then...

```csharp
struct Test2_4
{
	MyStruct i;

	public ref MyStruct FooBar(int index)
	{
		return ref i;
	}
}
```

And indeed it does. It fails with `error CS8170: Struct members cannot return 'this' or other instance members by reference`. And also the `this` makes sense.

Wait a minute. But with `static` again, this should work...

```csharp
struct Test2_5
{
	static MyStruct i;

	public ref MyStruct FooBar(int index)
	{
		return ref i;
	}
}
```

Works. Even though the field is declared in a `struct`, it's going to be allocated on the heap, because it's `static` (on a so called _High Frequency Heap_).

#### #3

```csharp
class Test3
{
	public ref MyStruct FooBar(MyStruct[] v, int index)
	{
		return ref v[index];
	}
}
```

Yeah, that's like the most basic example actually. I can then call it with this code...

```csharp
var local = new MyStruct();
var arr = new[] { local };

Console.WriteLine(local.I);
Console.WriteLine(arr[0].I);
Console.WriteLine();

var x1 = new Test3().FooBar(arr, 0);
x1.I = 1;
Console.WriteLine(local.I);
Console.WriteLine(arr[0].I);
Console.WriteLine();

ref var x2 = ref new Test3().FooBar(arr, 0);
x2.I = 1;
Console.WriteLine(local.I);
Console.WriteLine(arr[0].I);
Console.WriteLine();
```

...and get output:

```text
0
0

0
0

0
1

```

Makes sense. I don't care where the `v` came from in the `FooBar`. As long as it was passed to me, I can return reference back to it to the caller, because caller will have access to it for sure.

Or maybe... Can I maybe push it bit further? ;)

```csharp
unsafe public ref MyStruct FooBar(MyStruct* v, int index)
{
	return ref v[index];
}
```

```csharp
unsafe
{
	var local = new MyStruct();
	MyStruct* arr = stackalloc[] { local };

	Console.WriteLine(local.I);
	Console.WriteLine(arr[0].I);
	Console.WriteLine();

	var x1 = new Test3().FooBar(arr, 0);
	x1.I = 1;
	Console.WriteLine(local.I);
	Console.WriteLine(arr[0].I);
	Console.WriteLine();

	ref var x2 = ref new Test3().FooBar(arr, 0);
	x2.I = 1;
	Console.WriteLine(local.I);
	Console.WriteLine(arr[0].I);
	Console.WriteLine();
}
```

Yeah, works, same output. Everything is fine. :)

#### Closing

This was very nice exploration. All I needed was few moments of playing with the code and exploring basics and seeing what's allowed and what's not - and thinking why - and building on top of that. Hope this raw brain dump is going to help you as well.

[1]: https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/ref-returns