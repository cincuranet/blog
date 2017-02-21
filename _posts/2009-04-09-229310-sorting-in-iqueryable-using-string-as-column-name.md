---
title: |
  Sorting in IQueryable using string as column name
date: 2009-04-09T20:33:00Z
tags:
  - Entity Framework
  - LINQ
layout: post
---
Today my UI/ASP.NET guru workmate asked me whether it's possible to provide sorting methods on queries (in our case Entity Framework) using column name as string instead of expression. Well, I thought, why it shouldn't.

My first attention got to the [MetadataWorkspace][1]. After couple of attempts it became clear that this is not the best way. So I switched my attention to the expression trees. And that was the way. I ended up with this result.

```csharp
private static IOrderedQueryable<T> OrderingHelper<T>(IQueryable<T> source, string propertyName, bool descending, bool anotherLevel)
{
    ParameterExpression param = Expression.Parameter(typeof(T), string.Empty); // I don't care about some naming
    MemberExpression property = Expression.PropertyOrField(param, propertyName);
    LambdaExpression sort = Expression.Lambda(property, param);
    MethodCallExpression call = Expression.Call(
        typeof(Queryable),
        (!anotherLevel ? "OrderBy" : "ThenBy") + (descending ? "Descending" : string.Empty),
        new[] { typeof(T), property.Type },
        source.Expression,
        Expression.Quote(sort));
    return (IOrderedQueryable<T>)source.Provider.CreateQuery<T>(call);
}
public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName)
{
    return OrderingHelper(source, propertyName, false, false);
}
public static IOrderedQueryable<T> OrderByDescending<T>(this IQueryable<T> source, string propertyName)
{
    return OrderingHelper(source, propertyName, true, false);
}
public static IOrderedQueryable<T> ThenBy<T>(this IOrderedQueryable<T> source, string propertyName)
{
    return OrderingHelper(source, propertyName, false, true);
}
public static IOrderedQueryable<T> ThenByDescending<T>(this IOrderedQueryable<T> source, string propertyName)
{
    return OrderingHelper(source, propertyName, true, true);
}
```

It's a set of extension methods with similar signature as the classic ones OrderBy, ThenBy, etc. only taking string parameter instead of expression. This string parameter is name of field in class to be used for sorting. Enjoy.

[1]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.metadataworkspace.aspx