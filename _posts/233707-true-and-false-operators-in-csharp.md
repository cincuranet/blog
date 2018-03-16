---
title: |-
  True and false operators in C#
date: 2018-03-15T15:13:00Z
tags:
  - C#
---
Few days ago, I learned new thing about C#. Apparently, there are "true" and "false" operators and you can overload these. But I also wanted to know what are these good for, given I've never heard about these. 

<!-- excerpt -->

Let's start with simple (and dummy) code to see what's what.

```csharp
class TrueFalseOperator
{
	public TrueFalseOperator(int value)
	{
		Value = value;
	}

	public int Value { get; }

	public static bool operator true(TrueFalseOperator value)
	{
		Console.WriteLine("true");
		return value.Value == 0;
	}

	public static bool operator false(TrueFalseOperator value)
	{
		Console.WriteLine("false");
		return !(value.Value == 0);
	}
}
```

OK, that compiles. One thing I noticed while typing this is that you have implement both `true` and `false`. If you omit one compiler will remind you. But what are these used?

In documentation ([here][2] and [here][3]) we can find useful piece of historical context.

> Prior to C# 2.0, the true and false operators were used to create user-defined nullable value types that were compatible with types such as SqlBool. However, the language now provides built-in support for nullable value types, and whenever possible you should use those instead of overloading the true and false operators. For more information, see Nullable Types. With nullable Booleans, the expression a != b is not necessarily equal to !(a == b) because one or both of the values might be null. You have to overload both the true and false operators separately to correctly handle the null values in the expression.

Nice to know. That explains why I've never heard about these although I used C# before version 2.0. I wasn't digging deep at that time.

But can these operators be used in "regular" code? The `true` seems to be a candidate for `if`, `while`, ... conditions.

```csharp
var value = new TrueFalseOperator(10);
if (value)
{

}
```

And it actually calls the `true` method. What if I simply swap the condition to `if (!value)`, will it call `false`? Not. The compiler gives an error saying `Operator '!' cannot be applied to operand of type 'TrueFalseOperator'`. Makes sense. But where is the `false` actually used?

After some research on interwebs I've found information about `&&` operator being non-overridable and how it's evaluated and how you can eventually somewhat overload it by using `&` overload. The `x && y` is evaluated as `T.false(x) ? x : T.&(x, y)` (see §7.12.2 in [C# specification][1]). Building on that the class above can be modified by adding the `&&` overload (again dummy implementation).

```csharp
public static TrueFalseOperator operator &(TrueFalseOperator lhs, TrueFalseOperator rhs)
{
	return null;
}
```

Then using `if (value && value)` triggers the code path into `false` method. Mission completed.

What to do with this knowledge? I don't know. I'll shelve it into the corner of my head and one day it will become interesting topic to discuss near glass of beer.

[1]: https://www.microsoft.com/en-us/download/details.aspx?id=7029
[2]: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/true-operator
[3]: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/false-operator 