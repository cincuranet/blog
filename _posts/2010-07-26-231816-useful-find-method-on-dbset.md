---
title: |
  Useful Find method on DbSet
date: 2010-07-26T06:09:29Z
tags:
  - Entity Framework
layout: post
---
The [ObjectStateManager][1] contains a lot of information about entities currently in context. In fact it contains complete entities too. So you can try to look into it before issuing query and use it as [local cache][2]. For some simple cases, like PK match, you can create extension method in no time.

But in [current feature pack][3] for Entity Framework 4 if you're using new `DbSet` object you can find `Find` method, which does exactly this.

You provide PK value (or values if it's composite) and it'll first look for that object locally and if not found it'll try to fetch it from database.

```csharp
using (testEntities ent = new testEntities())
{
	var data = ent.Masters.Select(x => x.ID).Take(1).First();
	var item1 = ent.Masters.FirstOrDefault(x => x.ID == data);
	// Find method will find it locally, no querying will be done
	var item2 = ent.Masters.Find(data);
}
using (testEntities ent = new testEntities())
{
	var data = ent.Masters.Select(x => x.ID).Take(1).First();
	//var item1 = ent.Masters.FirstOrDefault(x => x.ID == data);
	// here the Find method will not find it and will query database
	var item2 = ent.Masters.Find(data);
}
```

It's nothing from what you'll be excited couple of hours, but every little counts.

[1]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectstatemanager.aspx
[2]: {% post_url 2009-02-22-229047-local-queries-2nd-edition %}
[3]: http://www.microsoft.com/downloads/details.aspx?displaylang=en&FamilyID=4e094902-aeff-4ee2-a12d-5881d4b0dd3e