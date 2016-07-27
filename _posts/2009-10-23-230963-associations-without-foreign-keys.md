---
title: "Associations without foreign keys"
date: 2009-10-23T09:00:54Z
tags:
  - Entity Framework
redirect_from: /id/230963/
layout: post
---
[Michal Bláha][1] asked me, before [my session][2] when I stopped in his office, whether it's possible to create associations in Entity Data Model without foreign keys in database, as he's not using FKs, he's enforcing referential integrity in application (yeah, if you're transaction guy like I am, your brain is about to blow).

Well, it's for sure possible. First we define some simple tables:

```sql
create table test_master(
  id int primary key,
  foo nvarchar(20) not null
);
create table test_detail(
  id int primary key,
  id_master int not null,
  bar nvarchar(20) not null
);
```

You see, no FK defined. Then you generate model from database, just next > next > finish style and you end up with:

![image]({{ site.address }}/i/230963/associations_no_fk_1.png)

Now the magic begins. :) Just kidding. First delete the `id_master` column from entity, it has nothing to do in conceptual model. Next create new association (right click in empty space in designer) and create it as 1-*. OK, we're almost there. The last step, is to map the association. It's mapped to `test_detail`: `test_master.id` to `id_master` and `test_detail.id` to `id`.

![image]({{ site.address }}/i/230963/associations_no_fk_2.png)

Now you can start querying the data across associations.

```csharp
string s = context.test_master.Include("test_details").ToTraceString();
```

Easily done, isn't it.

[1]: http://blog.vyvojar.cz/michal
[2]: {{ site.address }}{% post_url 2009-10-03-230843-prednaska-ado-net-entity-framework-microsoft-praha %}