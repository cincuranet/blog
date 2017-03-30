---
title: |-
  Easier ArgumentException messages
date: 2012-07-31T14:53:43Z
tags:
  - .NET
  - C#
  - Programming in general
layout: post
---
It's a good practice to include parameter name when throwing [ArgumentException][1] (or similar). But I hate typing the parameter name as string. It's A) boring and B) dumb, because when you refactor the parameter name you have to manually also change this string.

But why not let the language constructs help us? 8-) If we capture the parameter as _expression_ we'll be able to use static typing and extract the name from the expression node.

Shouldn't be that hard, I thought one afternoon, and here's the result (it really isn't).

```csharp
static string ArgumentExceptionMessage<T>(Expression<Func<T>> argument)
{
	var me = argument.Body as MemberExpression;
	if (me == null)
		throw new ArgumentException("Cannot extract argument name.", ArgumentExceptionMessage(() => argument));
	return me.Member.Name;
}
```

And you can use it (normally you would throw exception in all cases, I just wanted to show the result, hence `Console.WriteLine`).

```csharp
class Foo
{
	public int MyProperty { get; set; }
}

static void Main(string[] args)
{
	var f = new Foo();
	Console.WriteLine(ArgumentExceptionMessage(() => args));
	Console.WriteLine(ArgumentExceptionMessage(() => f.MyProperty));

	throw new ArgumentException("This argument is not correct.", ArgumentExceptionMessage(() => args));
}
```

There's never enough precondition checks. And understandable messages/parameters of exceptions is a valued help for developers. You can even wrap it to method returning `ArgumentException` directly to have more succinct code.

[1]: http://msdn.microsoft.com/en-us/library/system.argumentexception.aspx