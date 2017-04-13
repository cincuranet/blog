---
title: |-
  "Local" Queries 2nd edition
date: 2009-02-22T14:22:00Z
tags:
  - Entity Framework
  - LINQ
layout: post
---
[Danny Simmons posted][1] small helper method for runnning queries against local cache (in ObjectContext). Many of you are probably using similar method. But I don't like to have to specify entity set as a string. That's a first step for refactoring problems. :)

Thus I created little bit different version, using same trick as Matthieu Mezil with [Include][2].

```csharp
public static IEnumerable<TEntity> Local<TEntity, TObjectContext>(this ObjectContext context, Expression<Func<TObjectContext, ObjectQuery<TEntity>>> entitySet) where TEntity : class
{
    if (!(entitySet.Body is MemberExpression))
        throw new ArgumentException("entitySet");
    string name = ((MemberExpression)entitySet.Body).Member.Name;
    return context.Local<TEntity>(name);
}
```

It's using Danny's original one to do the dirty work ;), so it's just a small helper for helper. You can call it like `e.Local<DETAIL, MyEntities>(x => x.Details).ToArray();` instead of `e.Local<DETAIL>("Details").ToArray();`.

[1]: http://blogs.msdn.com/dsimmons/archive/2009/02/21/local-queries.aspx
[2]: {% include post_id_link.txt id="228036" %}