---
title: "How to map your custom objects in Entity Framework"
date: 2008-10-11T22:00:00Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - LINQ
  - Visual Studio
redirect_from: /id/228430/
category: none
layout: post
---
Well, generating EDMX file from database and letting Visual Studio to generate all the objects is easy. But sometimes you have your custom objects with custom logic. How to solve this? In version 1 of Entity Framework this isn't easy. It's possible, but not easy. The good news is, that for version 2 there is huge amount of work on POCO (<u>P</u>lain <u>O</u>ld <u>C</u>LR <u>O</u>bjects) with persistence ignorance.

With current version you have, in general, two possible choices. The "easier” way is to derive from special object `EntityObject`. Anyway, this is probably what you don't want, because you're probably deriving from your own objects (and as we know multiple inheritance isn't possible in C#). The other way is to implement some interfaces. It's not so straightforward, but, at least in my opinion, more practical.

In our simple example we'll be neither using complex types (it's not so hard to add it) nor any associations (I'll cover this later in other article). Let's start with our class, I'll call it Product and it'll be very simple.

```csharp
public class Product
{
  private int _id;
  private string _name;
  private int _price;
  public int ID
  {
    get { return _id; }
    set { _id = value; }
  }
  public string Name
  {
    get { return _name; }
    set { _name = value; }
  }
  public int Price
  {
    get { return _price; }
    set { _price = value; }
  }
}
```

As you can see, the class is really simple. You can imagine some logic i.e. on price or on name length. To make this object "tasty” for Entity Framework infrastructure you have to implement only one interface. It's called `IEntityWithChangeTracker`. For associations support you should implement also `IEntityWithRelationships`. There's also `IEntityWithKey` interface that forces you to implement `EntityKey` to improve performance and decrease memory usage. It's just cherry on a pie.

The first noted interface implementation is pretty easy. You'll just implement one method in easy way.

```csharp
void IEntityWithChangeTracker.SetChangeTracker(IEntityChangeTracker changeTracker)
{
  _changeTracker = changeTracker;
}
```

With complex types you have also set change tracker for these using `SetComplexChangeTracker` method.

To make change tracker working, we need to slightly change our setters. The setters should look like this for `Name` property.

```csharp
set
{
  if (_changeTracker != null)
    _changeTracker.EntityMemberChanging("Name");
  _name = value;
  if (_changeTracker != null)
    _changeTracker.EntityMemberChanged("Name");
}
```

Pretty simple, isn't it? The last thing you have to change in your class is to add `EdmScalarProperty` attribute to `ID`, `Name` and `Price` members. That's all you have to do with the class.

Now comes the tricky part (don't be scared it's not heavy magic :-)). First you need to get SSDL, MSL and CSDL files. These files contain store-schema, mapping and conceptual-schema definition. Although you can write these files by hand, using some tool is much faster. The easiest way is to generate these using EdmGen (or maybe [EdmGen2][1]). EdmGen is standard part of Entity Framework. Just use `FullGeneration` mode and provide `/connectionstring` and `/project` parameters. This gives you five files in result. Delete the two with `*.cs` extension, you don't need it. With EdmGen you get complete mapping for whole database so you have to delete some unnecessary stuff. Leave there only lines related to `Products` table (or whatever your table named is). If you don't understand content of these files, the best way is to generate `*.edmx` file in Visual Studio only for our table and look at the result <small>(EDMX file is in fact just CSDL, MSL and SSDL together plus some other stuff. You can use i.e. EdmGen2 to extract these files. But EdmGen2 isn't standard part of Entity Framework.)</small> right-clicking on the file and choosing `Open With...` and `XML Editor`. After this tricky part add these files to your project. On CSDL file open `Properties` and use for `Custom Tool` `EntityModelCodeGenerator`. This generates you new file under CSDL file. Copy content into new file and remove the `Custom Tool` definition. This new file contains implementation of `ObjectContext` class and also `Products` class. You can delete `Products` class (or class for your table), because we have ours. The last step is to replace occurrences of `Products` that has been removed, by `Product`, which is our class <small>(you can use Products (plural), where it makes sense, of course)</small>. So the result can look like this.

```csharp
public global::System.Data.Objects.ObjectQuery<Product> Products
{
  get
  {
    if ((this._Products == null))
    {
      this._Products = base.CreateQuery<Product>("[Product]");
    }
    return this._Products;
  }
}
private global::System.Data.Objects.ObjectQuery<Product> _Products;
public void AddToProducts(Product product)
{
  base.AddObject("Product", product);
}
```

You can also change the first constructor, if you're interested.

After this you can use standard ways to query or update the `Products` table. You have to provide "entity frameworkish” connection string to make it work. The first option is to embed CSDL, MSL and SSDL files into resources and use `res://<assemblyFullName>/<resourceName>` specification in connection string (more info on [http://msdn.microsoft.com/en-us/library/cc716756.aspx][2]) or simply copy these three files into some folder and use path. My choice was the second (copying files into same folder as executable), so my code looks like (using MS SQL Express):

```csharp
CustomClasses_EDMContext ctx = new CustomClasses_EDMContext("metadata=CustomClasses_EDM.csdl|CustomClasses_EDM.ssdl|CustomClasses_EDM.msl;provider=System.Data.SqlClient;provider connection string="Data Source=.\sqlexpress;Initial Catalog=test;Integrated Security=True"");
var q = from p in ctx.Products
where p.ID < 200
select p;
foreach (Product p in q)
{
  Console.WriteLine(p.Name);
  p.Name = p.Name + "R";
}
ctx.AddToProducts(new Product() { Name = "New Product", Price = 999 });
ctx.SaveChanges();
```

When you try to run this example, you'll be able not even to enumerate items in table (products), but also to update, add etc. it.

It's not as fast as using designer, you have to do some manual work (but I think you can write some tool to automate it and also EdmGen2 will help), however you're using your custom objects (without rewriting these completely).

The work on POCO and persistence ignorance in version 2 of Entity Framework will be a step forward, no doubts, but this isn't too bad isn't it? :-)

See also: [How to use custom objects with associations in Entity Framework][3]

_Published on [Databazovy Svet][4]_

[1]: {{ site.address }}{% post_url 2008-07-08-227892-edmgen-on-steroids-edmgen2 %}
[2]: http://msdn.microsoft.com/en-us/library/cc716756.aspx
[3]: {{ site.address }}{% post_url 2008-10-12-228431-how-to-use-custom-objects-with-associations-in-entity-framework %}
[4]: http://dbsvet.cz/