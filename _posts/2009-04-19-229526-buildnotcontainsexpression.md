---
title: "BuildNotContainsExpression"
date: 2009-04-19T10:28:00Z
tags:
  - Entity Framework
  - LINQ
redirect_from: /id/229526/
category: none
layout: post
---
[Colin Meek][1] wrote extremely handy method for using it as Contains method we know it's on collections, but not supported in Entity Framework right now (v1/EF3.5). The method is called BuildContainsExpression. Today in MSDN forums I needed this, but negated. Thus I wrote the BuildNotContainsExpression. It's just small change of original Colin's method.

```csharp
static Expression<Func<TElement, bool>> BuildNotContainsExpression<TElement, TValue>(Expression<Func<TElement, TValue>> valueSelector, IEnumerable<TValue> values)
{
    if (null == valueSelector) { throw new ArgumentNullException("valueSelector"); }
    if (null == values) { throw new ArgumentNullException("values"); }
    ParameterExpression p = valueSelector.Parameters.Single();
    // p => valueSelector(p) != values[0] && valueSelector(p) != ...
    if (!values.Any())
    {
        return e => true;
    }
    var equals = values.Select(value => (Expression)Expression.NotEqual(valueSelector.Body, Expression.Constant(value, typeof(TValue))));
    var body = equals.Aggregate<Expression>((accumulate, equal) => Expression.And(accumulate, equal));
    return Expression.Lambda<Func<TElement, bool>>(body, p);
}
```

[1]: http://blogs.msdn.com/meek/