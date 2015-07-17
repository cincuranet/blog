---
title: "Custom logic in every Entity Framework's query"
date: 2011-12-11T13:41:50Z
tags:
  - Entity Framework
  - Entity SQL
redirect_from: /id/232589/
category: none
layout: post
---
Few days ago there was a question on Twitter in [`#efhelp`][1] about adding custom logic to every query in Entity Framework. It's pretty easy and you can do it absolutely transparently so nobody using your code needs to know.

First you need to focus you [Entity Set][2] (not [Entity Type][3]) in [Model Browser][4] window.

![image]({{ site.url }}/i/232589/CustomLogicEntitySet1.png)

Here set the access modifier to i.e. `private` or (`internal`/`protected`) and rename it to something else, so it'll not interfere with original name of property we're going to create. I often use `X` prefix (especially for properties on entities).

![image]({{ site.url }}/i/232589/CustomLogicEntitySet2.png)

Now it's pretty easy to create some logic. Here I simply added filtering to always only fetch entities younger than 10 days from now.

```csharp
partial class Model1Container
{
	public IQueryable<FooBarEntity> FooBarEntitySet
	{
		get
		{
			DateTime d = DateTime.UtcNow.AddDays(-10);
			return XFooBarEntitySet.Where(fb => fb.Created > d);
		}
	}
}
```

And that's it. Not a difficult task. But also note that through [Entity SQL][5] (or i.e. reflection) somebody might be still able to access original entity set and get access to the data. So it's not rock hard security solution.

[1]: {{ site.url }}{% post_url 2011-11-11-232567-improved-efhelp-hashtag-cooperation-with-efhelp %}
[2]: http://msdn.microsoft.com/en-us/library/ee382830.aspx
[3]: http://msdn.microsoft.com/en-us/library/ee382837.aspx
[4]: http://msdn.microsoft.com/en-us/library/bb738483.aspx
[5]: http://msdn.microsoft.com/en-us/library/bb399560.aspx