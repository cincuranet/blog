---
title: |-
  MetadataWorkspace in Entity Framework
date: 2009-06-14T15:07:00Z
tags:
  - Entity Framework
  - LINQ
---
A lot of people get used to understand the [ObjectStateManager][1] class. Yep, it's the place where all the change tracking magic happens. But there's also one other place that's interesting. It's [MetadataWorkspace][2]. With this class' properties and methods you can find almost everything about stuff in your model, in runtime.

The information inside MetadataWorkspace is among others organizes into so-called spaces ([DataSpace enum][3]). Probably CSpace and SSpace are the most used. The CSpace contains stuff you have in your conceptual model (what you see in designer) and SSpace contains stuff from store model, so the database "structure".

The items in MetadataWorkspace can be anything from the [Metadata Type Hierarchy][4] (definitely look at this link) starting with GlobalItem. This contains i.e. EntityType, ComplexType or EdmFunction. These types inside are containing a lot of other useful information. Thus when you want to show i.e. all tables and primary keys for these tables you can use (don't forgot to first, for example, query for one record to load metadata or use [this trick][5]):

```csharp
MetadataWorkspace mw = ent.MetadataWorkspace;
var items = mw.GetItems<EntityType>(DataSpace.SSpace);
foreach (var i in items)
{
    Console.WriteLine("Table Name: {0}", i.Name);
    Console.WriteLine("Keys:");
    foreach (var key in i.KeyMembers)
    {
        Console.WriteLine("t {0} ({1})", key.Name, key.TypeUsage.EdmType.FullName);
    }
}
```

I'm first asking for all entity types from store space, which gives us all tables there. Then I'm simply inspecting the properties to get some useful info - first the name of table and then all key members reading name and type (EdmType). Also the [MetadataProperties][6] is definitely worth looking (see below). It's just a tip of an iceberg, and that was not difficult. You can literally get any information you've ever seen in your model.

And not only what you've seen in your model directly. For instance, the provider may expose some store specific functions you can use in ESQL queries. So the code:

```csharp
var functions = mw.GetItems<EdmFunction>(DataSpace.SSpace);
foreach (EdmFunction function in functions.Where(f => (bool)f.MetadataProperties["BuiltInAttribute"].Value))
{
    Console.WriteLine(function.FullName);
}
```

Gives you all of these functions. If you remove the condition you'll get all functions, including stored procedures of user defined functions. Wanna parameters of these functions? No problem, it's there. Just check [Parameters property][7].

And that's only the SSpace. The conceptual part of model is described there too. To see how much is the model interconnected (i.e. to consider [pregenerating views][8]) simply run:

```csharp
var entities = mw.GetItems<EntityType>(DataSpace.CSpace);
foreach (var entity in entities)
{
    Console.WriteLine("Table Name: {0}", entity.Name);
    Console.WriteLine("Navigation Properties#: {0}", entity.NavigationProperties.Count);
}
```

Interesting may be also the object model aka objects created from conceptual model. Although I can continue with some more or less useful examples - to see all to posibilities (and also hit the accessibility limitations), try it yourself. And if you stuck, feel free to ask (here or in [forums][9]).

[1]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectstatemanager.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.metadataworkspace.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.dataspace.aspx
[4]: http://msdn.microsoft.com/en-us/library/bb399772.aspx
[5]: http://thedatafarm.com/blog/data-access/quick-trick-for-forcing-metadataworkspace-itemcollections-to-load/
[6]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.metadataitem.metadataproperties.aspx
[7]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.edmfunction.parameters.aspx
[8]: {% include post_link id="228787" %}
[9]: http://social.msdn.microsoft.com/Forums/en-US/adodotnetentityframework/