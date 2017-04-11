---
title: |-
  Include with filtering or limiting
date: 2012-03-06T08:22:09Z
tags:
  - Entity Framework
  - Expressions
  - LINQ
layout: post
---
Almost four years ago I wrote an article [Load with filtering or limiting][1]. You might want to do same stuff with [`Include`][2] method. It's not directly supported in this method but you can do it with anonymous object easily. There's only one catch, it's the anonymous object. That means, if you need the entities you need to manually select these out on [`IEnumerable<T>`][3] (doing it on query isn't going to work because [Entity Framework][4] will (correctly) figure out you're not using the pieces of anonymous object and will change the generated query appropriately).

Small example:

```csharp
context.EntitySet
	.Select(x => new { Entity = x, Related = x.Related.OrderBy(y => y.FooBar).Take(6) })
	.AsEnumerable()
	.Select(x => x.Entity)
	.ToArray();
```

Nothing fancy. But could it be wrapped inside method so you don't have to type it over and over again. In comments of [above mentioned post][5] same question was raised. Well if I can write it manually, why it shouldn't be possible to extract it into method, right? Don't know whether this method has any real usage, but it was a nice exercise.

```csharp
public static IEnumerable<TMain> Include2<TMain, TOther>(this IQueryable<TMain> source, Expression<Func<TMain, IEnumerable<TOther>>> path)
	where TMain : class
{
	TMain main = default(TMain);
	var dummy = new { Main = main, Included = Enumerable.Empty<TOther>() };
	Expression<Func<TMain, object>> exampleExpression = x => new
	{
		Main = x,
		Included = Enumerable.Empty<TOther>()
	};
	PropertyInfo mainProperty = dummy.GetType().GetProperty("Main");
	ParameterExpression accessParam = Expression.Parameter(dummy.GetType(), "x");
	Delegate mainBack = Expression.Lambda(Expression.MakeMemberAccess(accessParam, mainProperty), accessParam).Compile();
	NewExpression body = (exampleExpression.Body as NewExpression);
	Type anonymousType = body.Type;
	var parametersMap = exampleExpression.Parameters.Select((f, i) => new { f, s = path.Parameters[i] }).ToDictionary(p => p.s, p => p.f);
	Expression reboundBody = ParameterRebinder.ReplaceParameters(parametersMap, path.Body);
	NewExpression newExpression = body.Update(new[] { body.Arguments[0], reboundBody });
	LambdaExpression finalLambda = Expression.Lambda(newExpression, exampleExpression.Parameters);
	MethodInfo miA = typeof(Queryable).GetMethods()
		.Where(m => m.Name == "Select")
		.Where(m => m.GetParameters()[1].ParameterType.GetGenericArguments()[0].GetGenericArguments().Count() == 2)
		.First();
	MethodInfo miB = typeof(Enumerable).GetMethods()
		.Where(m => m.Name == "Select")
		.Where(m => m.GetParameters()[1].ParameterType.GetGenericArguments().Count() == 2)
		.First();
	MethodInfo selectAMethod = miA.MakeGenericMethod(typeof(TMain), anonymousType);
	var dataA = selectAMethod.Invoke(null, new object[] { source, finalLambda });
	MethodInfo selectBMethod = miB.MakeGenericMethod(anonymousType, typeof(TMain));
	var dataB = selectBMethod.Invoke(null, new object[] { dataA, mainBack });
	return dataB as IEnumerable<TMain>;
}
```

The method is doing little bit of magic with expressions and anonymous type to do what you would normally write by hand. It returns [`IEnumerable<T>`][6] because the object needs to be unwrapped locally so you can't add additional pieces into query. I'm using `ParameterRebinder` from [Colin Meek's post][7] to properly rewire parameters. Same functionality can be also found in [Mono.Linq.Expressions][8].

From input parameters types (yeah, _the power of static typing [[Anders Hejlsberg][9]]_) you can see how to use it:

```csharp
context.EntitySet
	.Include2(x => x.Related.OrderBy(y => y.FooBar).Take(6))
	.ToArray();
```

That's all. 8-)

[1]: {% post_url 0000-00-00-229660-load-with-filtering-or-limiting %}/
[2]: http://msdn.microsoft.com/en-us/library/bb738708.aspx
[3]: http://msdn.microsoft.com/en-us/library/9eekhta0.aspx
[4]: http://msdn.microsoft.com/en-us/data/aa937723
[5]: {% post_url 0000-00-00-229660-load-with-filtering-or-limiting %}/
[6]: http://msdn.microsoft.com/en-us/library/9eekhta0.aspx
[7]: http://blogs.msdn.com/b/meek/archive/2008/05/02/linq-to-entities-combining-predicates.aspx
[8]: http://nuget.org/packages/Mono.Linq.Expressions
[9]: http://en.wikipedia.org/wiki/Anders_Hejlsberg