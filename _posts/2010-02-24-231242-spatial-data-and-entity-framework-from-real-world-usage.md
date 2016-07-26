---
title: "Spatial data and Entity Framework - from real world usage"
date: 2010-02-24T21:57:59Z
tags:
  - Entity Framework
  - Geometry
  - LINQ
  - MS SQL Server
  - Spatial data
  - T-SQL
redirect_from: /id/231242/
category: none
layout: post
---
[Julie Lerman created a post][1] about spatial data usage in Entity Framework. Her conclusions are correct. But because from last three projects I did on Entity Framework two of them are working with spatial data (every customer wants a Google Maps or Bing Maps on website, it's like cup holders in cars) I would like share my solution as well some ideas behind why I used this approach.

First and foremost Entity Framework doesn't support spatial data now. So you have to create some workaround. The idea getting the data through blob is exactly what I created. In my tables where I need to save some coordinates (it's mainly a point) I create simple column with this data type – I consider this clean initial work better, because maybe sometimes/somewhere/somebody will work with this structures so to have it clean. Then for the workaround I add XXX_bin column where I'll store the binary representation of spatial data and use it for Entity Framework. Something like this:

```sql
[Location] geography Default geography::STGeomFromText('POINT EMPTY', 4326) NOT NULL,
[Location_bin] Varbinary(max) NOT NULL,
```

Because I'm working only through Entity Framework I need to update the `Location` automatically as there might be (and are) indices or other stuff working with it. To make it transparent I'm using `insert or update` trigger:

```sql
if (update(Location_bin))
begin
  update %tablename% set
    Location = geography::STGeomFromWKB(Location_bin, 4326)
  where
     ID in (select ID from inserted);
end
```

If you expect somebody updating the `Location` column directly too, you need to create another trigger and make sure you'll not end up in infinite loop.

To support the – in my case – points for UI developers I create in every entity computed property turning `Location_bin` into my `LatLong` struct. This struct is using [Microsoft.SqlServer.Types][2] namespace.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Types;
namespace FooBar
{
    public struct LatLong
    {
        public double Lat { get; set; }
        public double Long { get; set; }
      public static LatLong FromSqlBytes(byte[] bytes)
      {
        SqlGeography g = SqlGeography.STGeomFromWKB(new SqlBytes(bytes), 4326);
        return new LatLong { Lat = g.Lat.Value, Long = g.Long.Value };
      }
      public byte[] ToSqlBytes()
      {
        return SqlGeography.Point(this.Lat, this.Long, 4326).STAsBinary().Buffer;
      }
    }
}
```

```csharp
public LatLong Location
{
  get
  {
    return LatLong.FromSqlBytes(this.Location_bin);
  }
  set
  {
    this.Location_bin = value.ToSqlBytes();
  }
}
```

This creates almost seamless support for other developers when using spatial data in Entity Framework – inserting, updating, deleting all works without notice from others (if you're not looking into internal implementation).

There are only two problems, both solvable.

First one is that developer cannot filter/sort/… using Location property. This isn't probably a big problem. As (s)he doesn't have spatial methods (like i.e. `Distance`) available, so the queries will not make sense. Which brings me to the other problem and that's the querying. With EFv1 I created stored procedures for these queries and returned data through these. Same works for EFv4. If you have strict set of results you need, this is probably easiest solution. The other one, working in EFv4 is LINQ function imports via [EdmFunction][3] attribute. For computations I'm going to use I create function in T-SQL doing the work and I [import it][4] into my solution thru above noted attribute. The simple `Distance` method may look like:

```sql
create function Distance
(
  @Location_bin1 varbinary(max),
  @Location_bin2 varbinary(max)
)
returns int
as
begin
  return geography::STGeomFromWKB(@Location_bin1, 4326).STDistance(geography::STGeomFromWKB(@Location_bin2, 4326));
end
```

And

```csharp
[EdmFunction("model.Store", "Distance")]
internal static int Distance(this byte[] location1, byte[] location2)
{
  throw new NotSupportedException();
}
```

Sure, when calling this function for a big resultsets it may be a performance bottleneck <small>(I recommend doing there as much work as possible, even at the price of more functions doing similar stuff, to not create a deep function calls.)</small>, but with additional filters it works well.

```csharp
protected IQueryable<Something> SomethingInDistance(LatLong point, int distance)
{
  byte[] spatialData = point.ToSqlBytes();
  return this.Somethings.Where(o => o.Location_bin.Distance(spatialData) < distance);
}
```

Another way could be to create a view (if you know the parameters in advance) and do explicit join (table/entityset <> view/entityset) in EF. Or do the filtering on client (if reasonably small). And I'm sure I'll find other ways how to get the data you want back, simply choose what fits your needs best.

Although it may look like a lot of work, it isn't. In fact you're pretty fast (there's a high level of reusability) if you know what to do (and after one implementation you will).

[1]: http://thedatafarm.com/blog/data-access/yes-you-can-read-and-probably-write-spatial-data-with-entity-framework/
[2]: http://msdn.microsoft.com/en-us/library/microsoft.sqlserver.types(SQL.105).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.edmfunctionattribute(VS.100).aspx
[4]: {{ site.address }}{% post_url 2009-10-11-230897-model-defined-function-as-a-method-on-entity-or-on-type-for-store-function %}