---
title: |-
  Model Defined Function as a method on entity (or on type for store function)
date: 2009-10-11T12:56:49Z
tags:
  - Entity Framework
  - Entity SQL
  - LINQ
layout: post
---
Model Defined functions are [new feature][1] in EFv4. You simply define you function using EDM functions etc. in your model and then you can use it in your queries. With [EdmFunction][2] attribute you can also create stub function to use it in LINQ queries. That's all great, and even itself makes life with Entity Framework easier.

But if you call it from LINQ (my favourite  way of querying), it's kind of odd. You're writing it as:

```csharp
context.Persons2.Where(p => GetAge2(p) < 100);
```

And while I was preparing some demos for my [presentation][3], there was a flash of idea in my head. "What if I define the function stub as extension method?", I thought. Yes like:

```csharp
[EdmFunction("testovaciModel", "GetAge2")]
static int GetAge2(this Persons2 p)
{
	throw new NotSupportedException();
}
```

This should work, right? It's just sugar and the translation should work without complaining. And it really does. You can now write:

```csharp
context.Persons2.Where(p => p.GetAge2() < 100)
```

Sweet! You can still keep these MDF method stubs in one place but use it in more natural syntax.

And by the way, it works for [store functions][4] as well (you're just limited on types).

```csharp
[EdmFunction("testovaciModel.Store", "GetAge")]
static int GetAge(this DateTime born)
{
	throw new NotSupportedException();
}
```

```csharp
context.Persons2.Where(p => p.Born.GetAge() < 100)
```

I'm especially happy for store function exposed to LINQ. I'm using these in a reasonable amount in my databases and being able to filter using the function without wrapping the query into i.e. stored procedure or view is neat.

[1]: http://blogs.msdn.com/efdesign/archive/2009/01/07/model-defined-functions.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.edmfunctionattribute(VS.100).aspx
[3]: {% include post_id_link id="230843" %}
[4]: http://blogs.msdn.com/efdesign/archive/2008/10/08/edm-and-store-functions-exposed-in-linq.aspx