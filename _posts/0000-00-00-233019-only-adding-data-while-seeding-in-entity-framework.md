---
title: |-
  Only adding data while seeding in Entity Framework
date: 2012-10-14T18:17:17Z
tags:
  - Entity Framework
  - Expressions
---
I was doing my Entity Framework course this week ([contact me][1], if you're interested) and at one point we were in [Migrations][2] and I was explaining the [Seed method][3]. Maybe you know, by default, there's a sample showing handy method `AddOrUpdate` being available. And I got I question whether there's some method to just "add only". So when the record is already there, nothing will be added. Inserted new otherwise.

First i was trying to align in my brain real world usage for it. Help came from others with simple example. You're seeding initial users for application with some default passwords, real names and something more, but somebody already changed these. So you don't want to update these back to default values. That's the use case for the "add only".

While it's not hard to write this logic directly into the seeding method, it's good to encapsulate it. The `AddOrUpdate` has two overloads, one where you specify properties to use for matching and one where you don't and default key(s) are used. I created only the explicit one (it's easier; there's (currently) no one-line-way to get the key(s) for entity).

```csharp
public static void AddOnly<TEntity>(this IDbSet<TEntity> set, Expression<Func<TEntity, object>> identifierExpression, params TEntity[] entities) where TEntity : class
{
	var keyProperties = KeyMemberNames(identifierExpression);
	foreach (var entity in entities)
	{
		var parameter = Expression.Parameter(typeof(TEntity));
		var matchExpression = keyProperties
			.Select(key =>
				Expression.Equal(
					Expression.Property(parameter, key),
					Expression.Constant(typeof(TEntity).GetProperty(key).GetValue(entity, null))))
			.Aggregate<BinaryExpression, Expression>(null, (current, predicate) => (current == null) ? predicate : Expression.AndAlso(current, predicate));
		var match = set.SingleOrDefault(Expression.Lambda<Func<TEntity, bool>>(matchExpression, new[] { parameter }));
		if (match == null)
		{
			set.Add(entity);
		}
	}
}
static IEnumerable<string> KeyMemberNames<TEntity>(Expression<Func<TEntity, object>> keySelector)
{
	var memberExpression = keySelector.Body as MemberExpression;
	if (memberExpression != null)
	{
		return new[] { memberExpression.Member.Name };
	}
	var newExpression = keySelector.Body as NewExpression;
	if (newExpression != null)
	{
		return newExpression.Members.Select(x => x.Name);
	}
	throw new NotSupportedException();
}
```

You can specify the key as only one property as well as composite key.

```csharp
context.People.AddOnly(
	p => new { p.FullName, p.Id },
	new Person { FullName = "Andrew Peters" },
	new Person { FullName = "Brice Lambson" },
	new Person { FullName = "Rowan Miller" }
);
context.People.AddOnly(
	p => p.FullName,
	new Person { FullName = "Andrew Peters" },
	new Person { FullName = "Brice Lambson" },
	new Person { FullName = "Rowan Miller" }
);
```

I promised the students in my course to create method like this and publish it here. I hope they will visit my blog. :)

[1]: /about/
[2]: http://msdn.microsoft.com/en-us/library/cc716791.aspx
[3]: http://msdn.microsoft.com/en-us/library/hh829453(v=vs.103).aspx