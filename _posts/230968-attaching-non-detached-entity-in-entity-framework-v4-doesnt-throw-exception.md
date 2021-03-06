---
title: |-
  Attaching non-detached entity in Entity Framework v4 doesn't throw exception
date: 2009-10-23T18:47:01Z
tags:
  - Entity Framework
---
While slowly digging into Beta 2 of EF4 I discovered new nice "feature". In EF1, if you had code like this.

```csharp
master[] data;
using (testovaciEntities ent = new testovaciEntities())
{
	data = ent.masters.ToArray();
}
using (testovaciEntities ent = new testovaciEntities())
{
	foreach (master item in data)
	{
		ent.Attach(item);
	}
}
```

It threw `InvalidOperationException` saying `An entity object cannot be referenced by multiple instances of IEntityChangeTracker.`. Right but I don't have access to my previous context anymore. This behavior caused me a lot of headache and I created couple of hacks to workaround it. But the good news is that the code above works fine in EF4.

Neat! Together with other improvements I can get rid of my hacks and sleep well again. ;)