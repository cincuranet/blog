---
title: "Using custom properties as parameters in queries (in EF)"
date: 2009-08-28T10:43:34Z
tags:
  - .NET
  - C#
  - Entity Framework
  - LINQ
redirect_from: /id/230786/
layout: post
---
Most of the time you're using properties in objects that are also in database. But sometimes you may need to create property in object that's not in database - it's used only in this application or it's there custom logic. Then, if you wanna use it in queries, you're out. You can use only those properties declared in table, obviously.

But there's a solution. First, the property has to be created from some other properties, so you're able to do the same in database. And of course, functions used there needs to be translatable to store language too. This may limit you, but there's nothing you can do about it, except evaluating query on client side.

Let's have a table like this:

```sql
create table Foo (
  ID int primary key,
  IsAccepted bit,
  IsPaid bit not null,
  IsPacked bit not null,
);
```

And you wanna have property IsReadyToShip, in application. So you create:

```csharp
public bool IsReadyToShip
{
  get { return this.IsAccepted.HasValue && this.IsAccepted && this.IsPaid && this.IsPacked; }
}
```

But with this property you're not able to query for all Foos ready to ship. Luckily the solution is pretty easy. First you'll create expression for this:

```csharp
public static Expression<Func<Foo, bool>> IsReadyToShipExpression = f => f.IsAccepted.HasValue && f.IsAccepted && f.IsPaid && f.IsPacked;
```

Then you'l prepare static compiled version of this expression, just for performance reasons, you can compile it in getter everytime too:

```csharp
protected static Func<Foo, bool> IsReadyToShipFunc = IsReadyToShipExpression.Compile();
```

And finally the property:

```csharp
public bool IsReadyToShip
{
  get { return IsReadyToShipFunc(this); }
}
```

Right now we have the same result as before - working property. But because we also have the expressions of the property (and incidentally it's translatable to store language ;)), so we can use it for querying. You can use it in an easy way (`this` is in this case ObjectContext used in Entity Framework):

```csharp
public IQueryable<Foo> FoosReadyToShip
{
  get { return this.Foos.Where(Foo.IsReadyToShipExpression); }
}
```

Not the shortest way to do it. But if you don't wanna to write the condition again and again (and lower the maintainability) this is a way to do it.