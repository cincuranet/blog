---
title: "Master-detail magic that's completely clear"
date: 2014-07-07T07:54:00Z
tags:
  - Entity Framework
redirect_from: /id/233467/
category: none
layout: post
---
Last week participant on my [Entity Framework course][1] created a code that looked like it should not work, but it worked. And I had initially trouble explaining why. After I dug deep, almost running out of bullets :-), I finally saw it clearly. It made complete sense as computers follow steps _exactly_. Let's have a look. 

<!-- excerpt -->

It's a pretty simple master-detail scenario. Here's the setup.

```csharp
[DbConfigurationType(typeof(MyContextConfiguration))]
class MyContext : DbContext
{
	public MyContext()
		: base(new SqlConnection(@"Data Source=(localdb)\mssql;Initial Catalog=test;Integrated Security=True"), true)
	{ }

	public DbSet<Master> Masters { get; set; }
	public DbSet<Detail> Details { get; set; }
}

class MyContextConfiguration : DbConfiguration
{
	public MyContextConfiguration()
	{
		SetDatabaseInitializer(new DropCreateDatabaseAlways<MyContext>());
	}
}

class Master
{
	public int Id { get; set; }
	public int FooBar { get; set; }
	public ICollection<Detail> Details { get; set; }
}

class Detail
{
	public int Id { get; set; }
	public int FooBarBaz { get; set; }
	public int MasterId { get; set; }
	public Master Master { get; set; }
}
```

And now imagine this code.

```csharp
using (var ctx = new MyContext())
{
	var detail = new Detail() { FooBarBaz = 1234 };
	var master = new Master() { FooBar = 4321 };
	ctx.Details.Add(detail);
	ctx.Masters.Add(master);
	ctx.SaveChanges();
}
```

In case you missed it. The `master` and `detail` are not connected whatsoever. I'm not setting `MasterId` nor `Master` property (neither touching `Details` property, which is `null` anyway). Shouldn't the `SaveChanges` call fail? If you already tried the code, you know it didn't failed. But why?

Well, after the cloud of smoke from frustration in works settles and you start tearing it apart piece by piece, it's pretty obvious. The two entites are actually connected. The `master.Id` is `0`, because that's the default value for `int`. Same for `detail.MasterId`. Makes complete sense, right? And so when you save it, [Entity Framework][2] figures it needs to save `Master` entity first, get the `Id` and then continue with `Detail` entity, that is now with updated `MasterId` because of previous step.

And there you go. Completely clear, only once you do it really step by step. Still on a first sight bit counterintuitive.

[1]: http://www.x2develop.com
[2]: http://msdn.com/ef
