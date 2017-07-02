---
title: |-
  POCOs and Entity Framework's automagic association wiring
date: 2010-04-10T19:37:20Z
tags:
  - Entity Framework
---
Entity Framework has a nice ability to wire up associations on both ends when the related entities come into context. This feature is handy and you can use it to simulate some scenarios, like [this][1]. But we're on EFv4 time, everybody is using POCO. ;)

In last project I used POCO too, just to make myself more familiar with the way how it works in EFv4 and to face some challenges. Last week I was designing some flow, and I needed to have some related objects in memory too. I immediately jumped into [Include method][2] (actually I used [this][3] improved version). But later I couldn't help but wonder would the automagic association wiring with (pure) POCOs?

I created simple `master-detail` scenario and created these POCO classes (note I'm not going to use proxies).

```csharp
class Master
{
	public int ID { get; set; }
	public string Foo { get; set; }
	public ICollection<Detail> Details { get; set; }
	public Master()
	{
		this.Details = new List<Detail>();
	}
}
class Detail
{
	public int ID { get; set; }
	public string Bar { get; set; }
	public Master Master { get; set; }
}
```

And created test code (`testEntities` is a simple ObjectContext).

```csharp
using (testEntities ent = new testEntities())
{
	ent.ContextOptions.LazyLoadingEnabled = false;
	var details = ent.Details.ToArray();
	var q = ent.Masters;
	foreach (var item in q)
	{
		Console.WriteLine(item.Details.Count);
	}
	foreach(var item in details)
	{
		Console.WriteLine(item.Master.ID);
	}
}
```

If you run the code, you'll see it works as expected. Exactly like the generated classes, although these are (pure) POCO classes - no need to use proxies or any special collections. I like the smart work done behind by Entity Framework for me.

[1]: {% include post_link, id: "229660" %}
[2]: http://msdn.microsoft.com/en-us/library/bb738708.aspx
[3]: {% include post_link, id: "228036" %}