---
title: "OnValidate-like validation in Entity Framework"
date: 2009-02-24T04:57:00Z
tags:
  - Entity Framework
  - LINQ
redirect_from: /id/229056/
category: none
layout: post
---
Yesterday, while doing Entity Framework training, I got a good question. LINQ to SQL has a nice event called OnValidate, where you can validate your data. But Entity Framework classes don't. As the only one good point to do the validation of entities in Entity Framework is during in SaveChanges in SavingChanges event, we have to utilize this event and build validation there. 

And as we have access to our ObjectContext, we can get information from ObjectStateManager about, for us, interesting entities and do some validation. Good practice is to put your validation inside the object. To simplify the work with these objects, we can implement in partial classes some interface with i.e. IsValid property. Then before sending data to the database we can easily perform the validation. 

First create some interface:

```csharp
interface IValidatable
{
    bool IsValid { get; }
}
```

And implement it in entity objects:

```csharp
partial class Master : IValidatable
{
    public bool IsValid
    {
        get
        {
            return (!string.IsNullOrEmpty(this.Foo) && !string.IsNullOrEmpty(this.Bar));
        }
    }
}
partial class Detail : IValidatable
{
    public bool IsValid
    {
        get
        {
            return (this.Bar.Length > 3);
        }
    }
}
```

And finally we can implement SavingChanges event (maybe the OnContextCreated can be used to wire up this event):

```csharp
MyEntities entities = (MyEntities)sender;
foreach (var item in
    entities.ObjectStateManager.GetObjectStateEntries(System.Data.EntityState.Modified | System.Data.EntityState.Added)
        .Where(entry => (entry.Entity is IValidatable) && (!entry.IsRelationship))
        .Select(entry => entry.Entity as IValidatable))
{
    if (!item.IsValid)
    {
        // throw some exception
    }
}
```