---
title: |-
  Back to C# basics: Difference between "=>" and "{ get; } =" for properties
date: 2020-11-11T07:39:00Z
tags:
  - .NET
---
I recently realized, the difference between `=>` and `{ get; } =` for properties might not be as known as everybody thinks, based on code I saw multiple times.

<!-- excerpt --> 

Here's an example code.

```csharp
public class C
{
	public Foo A { get; } = new Foo();
	public Foo B => new Foo();
}
```

Is it the same or is it not? The answer is, it's not the same. The `A` property is property with _getter_ only (aka read only or immutable property). When `C` instance is created a new instance of `Foo` is assigned to the property and will be returned from now on. The `B` property defines also only _getter_, but this time the _getter_ contains the `new Foo();` as it's body, aka returning new instance of `Foo` every time you access `B`.

Putting it into barebone C#, it would look like this.

```csharp
public class C
{
	readonly Foo _a = new Foo();
	
	public Foo A
	{
		get { return _a; }
	}

	public Foo B
	{
		get { return new Foo(); }
	}
}
```

Makes sense?