---
title: "Mapping self references in Code First"
date: 2011-12-20T18:56:28Z
tags:
  - Entity Framework
redirect_from: /id/232594/
layout: post
---
From time to time I see people having problems to map self references in [Code First in Entity Framework][1]. It might be confusing what to do with [HasMany][2]/[WithMany][3] and [HasOptional][4]/[WithOptional][5].

So let's jump in. Define a pretty simple table:

```sql
create table SelfRefs (
  ID int primary key,
  FooBar varchar(20) not null,
  ID_Parent int
);
alter table SelfRefs add foreign key (ID_Parent) references SelfRefs(ID);
```

The corresponding class could be:

```csharp
class SelfRef
{
	public int ID { get; set; }
	public string FooBar { get; set; }
	public SelfRef ParentItem { get; set; }
	public int? ParentItemID { get; set; }
	public ICollection<SelfRef> ChildItems { get; set; }
}
```

Now the mapping. The "trick" here is to realize, that we have not only child->parent association, but also parent->children. The other one is implied from the first one. Hence every child item has optional parent. If the child item has no parent, it is actually a 1<sup>st</sup> level child, aka child of (invisible) "root" (`NULL` parent). That also means you can map it from both directions and result will be the same. Here's the example <small>(it's explicit a little more)</small> with both mappings (you can use both declarations together without any problem):

```csharp
class SelfRefConfiguration : EntityTypeConfiguration<SelfRef>
{
	public SelfRefConfiguration()
	{
		this.HasKey(x => x.ID);
		this.Property(x => x.ParentItemID).HasColumnName("ID_Parent");
		// starting from child with parent
		//this.HasOptional(x => x.ParentItem).WithMany(x => x.ChildItems).HasForeignKey(x => x.ParentItemID).WillCascadeOnDelete(false);
		// starting from parent with children
		this.HasMany(x => x.ChildItems).WithOptional(x => x.ParentItem).HasForeignKey(x => x.ParentItemID).WillCascadeOnDelete(false);
		this.Map(map =>
			{
				map.Properties(x => new { x.ID, x.FooBar, x.ParentItemID });
				map.ToTable("SelfRefs", "dbo");
			});
	}
}
```

Hope I made it a little bit more clear. If not, feel free to ask in comments.

[1]: http://msdn.microsoft.com/en-us/library/gg696172(v=vs.103).aspx
[2]: http://msdn.microsoft.com/en-us/library/gg671281(v=vs.103).aspx
[3]: http://msdn.microsoft.com/en-us/library/gg696687(v=VS.103).aspx
[4]: http://msdn.microsoft.com/en-us/library/gg671230(v=vs.103).aspx
[5]: http://msdn.microsoft.com/en-us/library/gg679294(v=VS.103).aspx