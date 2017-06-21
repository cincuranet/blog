---
title: |-
  How to use custom objects with associations in Entity Framework
date: 2008-10-12T22:00:00Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - LINQ
  - Visual Studio
---
Today I had some time and I spent it playing with associations mapping on custom objects. Adding new objects is easy. It's what you already know. The only one new part is work with associations and navigation properties. But as always when you stuck you can generate dummy EDMX file and look at the result. :-)

You can start from scratch and create all classes and so on as in previous article. But I'll start where I ended, it's little bit faster.

First thing you have to create is new class, related to our `Product` class. I'll create `ProductSize` class that will hold info about the size of product (don't try to find something useful on this, it's just a simple example). The class will contain only ID and Size property. You can take inspiration from previous article, it's almost same. What you have to add is an `IEntityWithRelationships` interface implementation to both classes. It's same for both. This interface forces you to implement `RelationshipManager` member.

```csharp
RelationshipManager IEntityWithRelationships.RelationshipManager
{
  get
  {
    if (_relationships == null)
      _relationships = RelationshipManager.Create(this);
    return _relationships;
  }
}
```

Now you have to either edit CSDL, MSL and SSDL files by hand (if your night reading is some `*.edmx` file) or generate these again using EdmGen/EdmGen2 and remove any unnecessary lines. Also you can rename some items to match your needs and class members (i.e. if you have `NavigationProperty` one-to-many on one side would be probably plural and on other side singular). Good checkpoint after this is to run EdmGen with `ValidateArtifacts` mode to uncover any problems.

After this you have to modify class that you get in previous article from custom tool usage. You have to apply `EdmRelationshipAttribute` using the assembly prefix, because it has `AttributeTargets.Assembly` as usage. When you use custom tool, it will be generated for you. When first trying to do the mapping I forgot about it and I lost half an hour of my time. :-)

```csharp
[assembly: EdmRelationship("CustomClasses_EDM", "FK_Products_ProductSizes", "ProductSizes", RelationshipMultiplicity.One, typeof(CustomClasses_EDM.ProductSize), "Products", RelationshipMultiplicity.Many, typeof(CustomClasses_EDM.Product))]
```

Now you only need to add navigation properties in your custom classes. Of course, you can add some properties to your `ObjectContext` class, similar to `Products`.

OK, first, apply `EdmRelationshipNavigationProperty` attribute to your navigation properties. For my `Product` object and `ProductSize` property it looks like this.

```csharp
[EdmRelationshipNavigationProperty("CustomClasses_EDM", "FK_Products_ProductSizes", "ProductSizes")]
```

Let's do the getter. You have to get `RelationshipManager` and use `GetRelatedReference` method. For my Products ⇒ ProductSizes direction you should end up with:

```csharp
get
{
  return ((IEntityWithRelationships)(this)).
    RelationshipManager.
    GetRelatedReference<ProductSize>("CustomClasses_EDM.FK_Products_ProductSizes", "ProductSizes").Value;
}
```

For other direction use the `GetRelatedCollection` method and no `Value` is used. The setter for Products ⇒ ProductSizes direction is just about assigning `value` to `Value`. For ProductSizes ⇒ Products it's little bit different. You have to use `InitializeRelatedCollection` method to set new value.

```csharp
((IEntityWithRelationships)(this)).
  RelationshipManager.
  InitializeRelatedCollection<Product>("CustomClasses_EDM.FK_Products_ProductSizes", "Products", value);
```

And maybe it's good idea to check for `null`s, because it's not allowed to put it there (again, just fine-tuning).

Now when you try to run the code like:

```csharp
var q = from p in ctx.Products
         where p.ID < 200
         select p;
foreach (Product p in q)
{
  Console.WriteLine(p.Name);
  Console.WriteLine("t" + p.ProductSize.Size);
}
```

You got exception. Yeah, lazy loading. You have to use, for example ([Entity Framework Include with Func][1]):

```csharp
var q = from p in ctx.Products.Include("ProductSize")
         where p.ID < 200
         select p;
foreach (Product p in q)
{
  Console.WriteLine(p.Name);
  Console.WriteLine("t" + p.ProductSize.Size);
}
```

Using custom objects and associations with Entity Framework isn't hard too. You generate three files from database, change it (which is maybe the hardest part – to match database to your objects) and small changes in objects. And you're done.

Yet again, with POCO and persistence ignorance it will much easier. But it isn't impossible now.

See also: [How to map your custom objects in Entity Framework][2]

_Published on [Databazovy Svet][3]_

[1]: {% include post_link id="228036" %}
[2]: {% include post_link id="228430" %}
[3]: http://dbsvet.cz/