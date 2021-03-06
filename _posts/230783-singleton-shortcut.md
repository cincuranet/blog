---
title: |-
  Singleton shortcut
date: 2009-08-26T18:54:29Z
tags:
  - .NET
  - C#
---
Probably every developer sometimes heard about the singleton pattern. I'll be not far from truth that you're probably writing it like this:

```csharp
class Foo1
{
	private static Foo1 _instance;
	public static Foo1 Instance
	{
		get
		{
			if (_instance == null)
				_instance = new Foo1();
			return _instance;
		}
	}
}
```

I do it same way. But today I seen little bit different way. It's using the C# coalesing operator and some C-like magic syntax.

```csharp
class Foo2
{
	private static Foo2 _instance;
	public static Foo2 Instance
	{
		get
		{
			return _instance ?? (_instance = new Foo2());
		}
	}
}
```

Looks cool, isn't it? On the other hand I'll probably use the first one, as it's more readable, at least for me.