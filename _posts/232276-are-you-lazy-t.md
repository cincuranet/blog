---
title: |-
  Are you Lazy<T>?
date: 2011-03-15T18:28:43Z
tags:
  - .NET
  - C#
---
Yesterday I was chatting with [Aleš Roubíček][1] after lunch and he told me he likes the Lazy<T> I put into project we're working right now and that could be worth to write about it.

Well, here it is. The [Lazy<T> class][2] is new in .NET Framework 4. Using this class is easy. If you don't wnat to create instance of some object until it's really needed this class will help you. And it can deal with multithreading as well.

So the well known code:

```csharp
Foo _foo;
public Foo Foo
{
	get
	{
		if (_foo == null)
			_foo = new Foo();
		return _foo;
	}
}
```

can be replaced with:

```csharp
Lazy<Foo> _foo = new Lazy<Foo>(() => new Foo());
public Foo Foo
{
	get
	{
		return _foo.Value;
	}
}
```

Nothing special, but when the multithreading comes into play, it's more fun. This class has a constructor taking [LazyThreadSafetyMode][3] and you can specify what kind of thread safety you want.

* `None` is obvious.
* `PublicationOnly` means, that the function creating value can be executed by more threads, but only one value will be used.
* `ExecutionAndPublication` ensures that the function creating value is executed only once.

By the way if you don't provide the function, the default constructor will be invoked.

Handy isn't it.

Let's play with it:

```csharp
class Program
{
	static void Main(string[] args)
	{
		Test(LazyThreadSafetyMode.PublicationOnly); // 2x ctor, True
		Console.WriteLine("===");
		Test(LazyThreadSafetyMode.ExecutionAndPublication); // 1x ctor, True
	}
	static void Test(LazyThreadSafetyMode mode)
	{
		Lazy<Foo> _foo1 = new Lazy<Foo>(() => new Foo(), mode);
		Foo f1 = null;
		Foo f2 = null;
		Parallel.Invoke(() => { f1 = _foo1.Value; }, () => { f2 = _foo1.Value; });
		Console.WriteLine("Same: {0}", object.ReferenceEquals(f1, f2));
	}
}
class Foo
{
	public Foo()
	{
		Console.WriteLine("Running Foo's ctor.");
		Thread.Sleep(2000);
		Console.WriteLine("About to finish ctor.");
	}
}
```

[1]: http://rarous.net/
[2]: http://msdn.microsoft.com/en-us/library/dd642331.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.threading.lazythreadsafetymode.aspx