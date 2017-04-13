---
title: |-
  Checking whether the type is a tuple (ValueTuple)
date: 2017-03-27T18:45:00Z
tags:
  - .NET
  - C#
layout: post
---
Continuing with my tuples ([`ValueTuple<...>`][1] to be precise) [exploration][2] in C# I was in a need to check whether the type is a "tuple". The `(T, T, T, ...)` in C#. You can create `ValueTuple<...>` yourself manually, but you can also create something that's not a tuple - compiler wouldn't do it that way. 

<!-- excerpt -->

For example `ValueTuple<int, int, int, int, int, int, int, int>` compiles fine, but the 8th element (`TRest`) should be another `ValueTuple<int>`. Similarly also plain `int` isn't a tuple, obviously.

So I wrote a small helper for myself.

```csharp
public static bool IsTuple(Type tuple)
{
	if (!tuple.IsGenericType)
		return false;
	var openType = tuple.GetGenericTypeDefinition();
	return openType == typeof(ValueTuple<>)
		|| openType == typeof(ValueTuple<,>)
		|| openType == typeof(ValueTuple<,,>)
		|| openType == typeof(ValueTuple<,,,>)
		|| openType == typeof(ValueTuple<,,,,>)
		|| openType == typeof(ValueTuple<,,,,,>)
		|| openType == typeof(ValueTuple<,,,,,,>)
		|| (openType == typeof(ValueTuple<,,,,,,,>) && IsTuple(tuple.GetGenericArguments()[7]));
}
```

To be touch bit sure it works as it should, here's some tests (using NUnit).

```csharp
[TestCase(typeof((int, int)), ExpectedResult = true)]
[TestCase(typeof((int, int, string, string, int, int, string, string, int, int)), ExpectedResult = true)]
[TestCase(typeof(int), ExpectedResult = false)]
[TestCase(typeof(ValueTuple<int, int, int, int, int, int, int, int>), ExpectedResult = false)]
[TestCase(typeof(ValueTuple<int, int, int, int, int, int, int, ValueTuple<string, string>>), ExpectedResult = true)]
public bool IsTupleTest(Type tuple)
{
	return TupleHelper.IsTuple(tuple);
}
```

There's one small catch, though. You can't really create a `ValueTuple<T>` (on a top level) using C# `(T)` syntax, because for the compiler the `(` and `)` are just plain parentheses, but I consider that for me as a valid tuple anyway.

[1]: https://www.nuget.org/packages/System.ValueTuple/
[2]: {% include post_id_link id="233601" %}