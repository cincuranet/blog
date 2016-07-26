---
title: "New Translate&lt;T&gt; and ExecuteStoreQuery&lt;T&gt; (+ExecuteStoreCommand) on ObjectContext in Entity Framework v4"
date: 2010-04-25T19:20:23Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
redirect_from: /id/231337/
category: none
layout: post
---
I don't know whether it's somewhere specifically pointed, but the [ObjectContext][1] in Entity Framework v4 has two (three) new handy methods. And I like these.

It's kind of escape hatch similar to [DefiningQuery][2]. First method is [Translate<T>][3]. It takes DbDataReader and materializes the data back into entities. It's similar to Materialize method from [EFExtensions][4]. If you some code in pure ADO.NET and you don't have time or resources to redo it in EF (or it's way easier old way) you can rewire the result into existing objects. I like it. Whenever I'll feel I need to get dirty (and probably due to performance reasons) I can do it pretty easily.

```csharp
using (testovaciEntities ent = new testovaciEntities())
{
	IDbConnection conn = (ent.Connection as EntityConnection).StoreConnection;
	conn.Open();
	using (IDbCommand cmd = conn.CreateCommand())
	{
		cmd.CommandText = "select * from master";
		using (DbDataReader reader = (DbDataReader)cmd.ExecuteReader())
		{
			MASTER[] result = ent.Translate(reader).ToArray();
			Console.WriteLine(result.Length);
		}
	}
}
```

The other method is similar and simplifies the process of getting dirty if you simply need to run you fine tuned query with neat and sexy constructs. :) It's [ExecuteStoreQuery<T>][5]. This method simply allows you to run any sql command directly in store language (thus you can use all features your database offers) and fetch and materialize back resulting entities. Similar to this is [ExecuteStoreCommand][6] which is similar to ExecuteNonQuery from pure ADO.NET. But you can do this without the method easily too, the method is just more convenient.

BTW also note that the Translate method isn't adding the entities into context, it's just about fetching and materializing.

[1]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb738450.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.translate.aspx
[4]: http://code.msdn.microsoft.com/EFExtensions
[5]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.executestorequery.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.executestorecommand.aspx