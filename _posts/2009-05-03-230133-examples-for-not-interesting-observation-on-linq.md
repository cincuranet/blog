---
title: |
  Examples for "(Not) interesting observation on LINQ"
date: 2009-05-03T11:06:00Z
tags:
  - LINQ
layout: post
---
After the post [(Not) interesting observation on LINQ][1] was out [Michal Blaha][2] asked me to show some example to show what I'm talking about. :) 

OK, here it is. This example shows the first observation from second paragraph (yep, it's second ;)). I'm using only Where, for the sake of simplicity. 

```csharp
class Program
{
    static void Main(string[] args)
    {
        Class1 a = new Class1();
        var q = from x in a
                where x.Foo > 20
                select new { Bar = x.Foo };
    }
}
class Class1
{
    public int Foo { get; set; }
    public IEnumerable<Class1> Where(Func<Class1, bool> predicate)
    {
        return new[] { this };
    }
}
```

No IQueryable, no querying provider stuff, etc. Compiles without problems, and runs without complaining. No magic, right? 

Now the third (last) paragraph. 

```csharp
class Program
{
    static void Main(string[] args)
    {
        Class1 a = new Class1();
        var q = from x in a
                where x.Foo > 20
                select new { Bar = x.Bar };
    }
}
class Class1
{
    public int Foo { get; set; }
    public IEnumerable<Class2> Where(Func<Class1, bool> predicate)
    {
        return new[] { new Class2() };
    }
}
class Class2
{
    public int Bar { get; set; }
}
```

The example is magically returning from Where IEnumerable of other class. :) Doing this with couple of standard LINQ operators may confuse your colleagues well. You can also check the "LINQ to Simpsons" from [Bart de Smet][3] to see comprehensive confusing.

[1]: {% post_url 2009-04-11-229357-not-interesting-observation-on-linq %}
[2]: http://blog.vyvojar.cz/michal/
[3]: http://community.bartdesmet.net/blogs/bart/Default.aspx