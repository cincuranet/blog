---
title: |-
  DbGeography and DbGeometry in Entity Framework - what's needed?
date: 2012-09-10T07:18:13Z
tags:
  - Entity Framework
  - Firebird
  - Spatial data
---
There seems to be a small confusion about what is needed to be able to use spatial data - exposed as [`DbGeography`][1] and [`DbGeometry`][2] types - in [Entity Framework][3].

It very much depends on provider, as expected. Of course you need to have Entity Framework 5 installed (you can get it either from NuGet or it's inside .NET 4.5). You can happily create context, use classes with above mentioned type(s), until you try to execute some query or do some CUD operation. Then it goes into provider's internals and it is responsible to provide some solution. It's interesting that the database doesn't have to support spatial data necessarily. If there will be some convention on the side of provider about translation into i.e. stored procedures/functions you're fine.

So the Entity Framework isn't doing any magic trying to store the spatial data. It simply relies on provider to do it, as with any type like `integer` or `decimal` for instance. And how do you know if the provider supports it? Well, very likely it's mirroring what the database supports. I doubt any general purpose ADO.NET provider will do some magic mapping and storing for spatial data if the database doesn't support it.

Example for Firebird (doesn't support spatial data):

```csharp
class MyContext : DbContext
{
	public MyContext()
		:base(new FbConnection("database=localhost:test.fdb;user=sysdba;password=masterkey;pooling=false"), true)
	{
	}
	public IDbSet<Person> People { get; set; }
}
class Person
{
	public int Id { get; set; }
	public string Name { get; set; }
	public DbGeography Position { get; set; }
}
```

```csharp
using (var db = new MyContext())
{
	Console.WriteLine(db.People.Where(x => x.Position.Distance(DbGeography.PointFromText("POINT(1 1)", 4326)) < 100));
}
```

Results in throwing `NotSupportedException` originating in `FirebirdSql.Data.FirebirdClient.FbProviderManifest`.

Let's intersect somewhere on geoid.

[1]: http://msdn.microsoft.com/en-us/library/system.data.spatial.dbgeography.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.spatial.dbgeometry.aspx
[3]: http://msdn.com/ef