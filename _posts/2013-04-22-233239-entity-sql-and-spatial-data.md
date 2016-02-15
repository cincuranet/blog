---
title: "Entity SQL and spatial data"
date: 2013-04-22T18:25:21Z
tags:
  - Entity Framework
  - Entity SQL
  - LINQ
  - Spatial data
redirect_from: /id/233239/
category: none
layout: post
---
When the [Entity Framework][1] was first introduced it came with (basically) two flavors of querying. [LINQ to Entities][2] and [Entity SQL][3] (ESQL). I'm not going to describe the history here. But as LINQ (any LINQ) gained popularity it was obvious, that LINQ to Entities is a future (though it had initially small deficit compared to Entity SQL). I even on [my courses][4] recommend using LINQ to Entities whenever possible and I'm also showing some dynamic querying where normally people start concatenating ESQL strings.

<!-- excerpt -->

Recently Entity Framework added support for spatial data (and enums, ...). All examples I've ever seen around spatial data and Entity Framework were using LINQ (obviously). Only few weeks ago I realized how the querying should work with Entity SQL. As it turned out spatial data are not first class citizen in Entity SQL world. There's no [literal][5] for i.e. point. But canonical functions are here to save you. There's a [bunch of these spatial data related][6]. What we're looking for though is `GeometryFromText`/`GeographyFromText`. With these you can [construct][7] `Geometry`/`Geography` datatype from [well-known text (WKT)][8] and use it in query.

I've never used Entity SQL query in any real-world application I created. I'm too afraid of typos etc. But I did a lot of magic with expression trees. :) Wondering what percentage of people using Entity Framework is using Entity SQL and whether there are some scenarios that are crazy hard in LINQ...

[1]: http://msdn.com/ef
[2]: http://msdn.microsoft.com/en-us/library/bb386964.aspx
[3]: http://msdn.microsoft.com/en-us/library/bb399560.aspx
[4]: http://www.x2develop.com
[5]: http://msdn.microsoft.com/en-us/library/bb399176.aspx
[6]: http://msdn.microsoft.com/en-us/library/hh749531.aspx
[7]: http://msdn.microsoft.com/en-us/library/dn133443.aspx
[8]: http://en.wikipedia.org/wiki/Well-known_text
