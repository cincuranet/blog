---
title: |-
  Set-reset easily
date: 2014-10-22T16:01:00Z
tags:
  - C#
---
I have to say I'm bit obsessed by writing as less code as possible and having compiler of language do the work. I don't like cryptic code, though. It needs to read easily. My problem today was simple. I needed simplify the code that sets new value into property, does something and sets back the original value.

Maybe you remember this from good old Delphi or WinForms days. Set the title of button to "Working...", do the work, put back whatever was on that button before.

<!-- excerpt -->

What I hate is creating variable to store old value and then set it back. It's like too much manual work.

```csharp
var oldValue = instance.Property;
instance.Property = newValue;
try
{
	DoSomething();
}
finally
{
	instance.Property = oldValue;
}
```

Not my kind of tea. Looking at it it very much looks like [`IDisposable` pattern][1], isn't it. That's just one step from implementation. Bit of magic with [`Expressions`][2] and it should be done.

```csharp
public class SetResetHelper
{
	struct ResetHolder<TObject, TValue> : IDisposable
	{
		readonly TObject _object;
		readonly PropertyInfo _property;
		readonly TValue _oldValue;

		public ResetHolder(TObject @object, PropertyInfo property, TValue oldValue)
		{
			_object = @object;
			_property = property;
			_oldValue = oldValue;
		}

		public void Dispose()
		{
			_property.SetValue(_object, _oldValue);
		}
	}

	public static IDisposable SetReset<TObject, TValue>(TObject @object, Expression<Func<TObject, TValue>> property, TValue value)
	{
		return ProcessSetReset(@object, GetProperty(property), value);
	}

	public static IDisposable SetReset<TValue>(Expression<Func<TValue>> staticProperty, TValue value)
	{
		return ProcessSetReset<object, TValue>(null, GetProperty(staticProperty), value);
	}

	static ResetHolder<TObject, TValue> ProcessSetReset<TObject, TValue>(TObject @object, PropertyInfo propertyInfo, TValue value)
	{
		var oldValue = (TValue)propertyInfo.GetValue(@object, null);
		propertyInfo.SetValue(@object, value);
		return new ResetHolder<TObject, TValue>(@object, propertyInfo, oldValue);
	}

	static PropertyInfo GetProperty(LambdaExpression propertyExpression)
	{
		var memberExpression = propertyExpression.Body as MemberExpression;
		if (memberExpression == null)
			throw new ArgumentException();

		var propertyInfo = memberExpression.Member as PropertyInfo;
		if (propertyInfo == null)
			throw new ArgumentException();

		return propertyInfo;
	}
}
```

Pretty simple. I'm using the `ResetHolder` to keep the information about original value (and some stuff for being able to set it back using [reflection][3]). The `SetReset` method supports both instance as well as static properties. I'm no checking the input much, only in `GetProperty` to be sure I get proper [`PropertyInfo`][4], so it's up to you to provide proper values (or add checking 8-)). That's it. Use it as you would use something `IDisposable`.

```csharp
using (SetResetHelper.SetReset(() => ServicePointManager.ServerCertificateValidationCallback, delegate { return true; }))
{
	// ...
}
```

```csharp
var instance = new Foo();
instance.FooBar = 10;
using (SetResetHelper.SetReset(instance, x => x.FooBar, 20))
{
	Console.WriteLine(instance.FooBar);
}
Console.WriteLine(instance.FooBar);
```

I'm pretty sure somebody did this before me. I just did it as a small mental training. And also because I needed it. :)

[1]: http://msdn.microsoft.com/en-us/library/b1yfkh5e(v=vs.110).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.linq.expressions(v=vs.110).aspx
[3]: http://en.wikipedia.org/wiki/Reflection_(computer_programming)
[4]: http://msdn.microsoft.com/en-us/library/system.reflection.propertyinfo(v=vs.110).aspx