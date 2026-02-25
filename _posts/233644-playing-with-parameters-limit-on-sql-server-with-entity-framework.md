---
title: |-
  Playing with parameters limit on SQL Server with Entity Framework
date: 2017-09-05T09:40:00Z
tags:
  - C#
  - .NET
  - Entity Framework
  - MS SQL Server
---
During a break of my [user group talk][2] yesterday I got a question about how Entity Framework translates `Contains` into an `IN` clause. Whether it uses parameters and how it handles limits that SQL Server has around the parameter count.

<!-- excerpt -->

#### Setup

Let's start with trivial model - `Person` and `Department` entities and simple `DbContext`.

```csharp
[DbConfigurationType(typeof(MyContextConfiguration))]
public class MyContext : DbContext
{
    public MyContext()
        : base(@"Data Source=.\sqlexpress;Initial Catalog=demo;Integrated Security=True;MultipleActiveResultSets=True")
    { }

    public DbSet<Person> People { get; set; }
    public DbSet<Department> Departments { get; set; }
}

public class MyContextConfiguration : DbConfiguration
{
    public MyContextConfiguration()
    {
        SetDatabaseInitializer<MyContext>(null);
    }
}

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual Department Department { get; set; }
    public int DepartmentId { get; set; }
}

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<Person> People { get; set; }
}
```

#### Regular LINQ

With that in place I can do simple query...

```csharp
using (var db = new MyContext())
{
    db.Database.Log = Console.WriteLine;

    var ids = Enumerable.Range(1, 20).ToArray();
    db.People.Where(x => ids.Contains(x.DepartmentId)).ToList();
}
```

...which results in this SQL.

```sql
SELECT
    [Extent1].[Id] AS [Id],
    [Extent1].[Name] AS [Name],
    [Extent1].[DepartmentId] AS [DepartmentId]
    FROM [dbo].[People] AS [Extent1]
    WHERE [Extent1].[DepartmentId] IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
```

No luck. The `IN` clause is there, but Entity Framework is using the values directly (and escaping these, i.e. in case it's a string). Looks like it's time to pull out some tricks.

#### Generating an expression tree

And what's a better trick than creating expression trees yourself? Well, I could write the whole `or`-ing manually, but that's not fun, is it?

```csharp
using (var db = new MyContext())
{
    db.Database.Log = Console.WriteLine;

    var closure = new Closure() { Id = 10 };
    var personType = typeof(Person);
    var personMember = personType.GetProperty(nameof(Person.DepartmentId));
    var closureType = typeof(Closure);
    var closureMember = closureType.GetProperty(nameof(Closure.Id));
    var p = Expression.Parameter(personType);
    var equalExpression = Expression.Equal(
            Expression.MakeMemberAccess(p, personMember),
            Expression.MakeMemberAccess(Expression.Constant(closure, closureType), closureMember));
    var expr = equalExpression;
    for (int i = 0; i < 2098; i++)
    {
        expr = Expression.OrElse(expr, equalExpression);
    }
    var predicate = (Expression<Func<Person, bool>>)Expression.Lambda(expr, p);
    db.People.Where(predicate).ToList();
}
```

The expression is not difficult to create. I first create the `Expression.Equal` part, which corresponds to `Person.DepartmentId == Closure.Id` roughly. Then I take this piece and glue it together 2098 times with `Expression.OrElse`. The `Closure` class is really a [_closure_][1] I had to manually create for integer variable I'm using in the equality expression.

```csharp
class Closure
{
    public int Id { get; set; }
}
```

When you're writing lambdas directly this is done for you automatically - you can spot something like `<>c__DisplayClassX` in i.e. debugger.

Running this code generates SQL, that contains 2099 parameters.

```sql
SELECT
    [Extent1].[Id] AS [Id],
    [Extent1].[DepartmentId] AS [DepartmentId],
    [Extent1].[Name] AS [Name]
    FROM [dbo].[People] AS [Extent1]
    WHERE [Extent1].[DepartmentId] IN (@p__linq__0,@p__linq__1,@p__linq__2,
...
@p__linq__2096,@p__linq__2097,@p__linq__2098)
```

This finally makes SQL Server unhappy and results in an exception telling me `The incoming request has too many parameters. The server supports a maximum of 2100 parameters. Reduce the number of parameters and resend the request.`. Although I have only 2099. Probably the message means `< 2100` and not `<= 2100` which is how I understand it intuitively.

#### Conclusion

This was a nice play with expressions. And as I'm finishing writing this post I'm thinking whether the fact that Entity Framework generates the `IN` clause with values, and goes into the hassle of escaping, instead of parameters has something to do with this limit. 🤔

[1]: https://en.wikipedia.org/wiki/Closure_(computer_programming)
[2]: {{ include "post_link" 233630 }}