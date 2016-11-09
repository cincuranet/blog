---
title: "Getting database script from DbContext (Code First)"
date: 2011-05-06T07:22:32Z
tags:
  - Entity Framework
layout: post
---
I was [speaking at Gopas Teched][1] few days ago and there was a good question from audience about how to get the SQL script the DbContext is using to create database.

I never thought about it as I always create database in ER tool as it provides more features (like triggers, stored procedures etc.). But I remembered I implemented this method in [.NET provider for Firebird][2]. So it has to be somewhere.

The method is called [CreateDatabaseScript and it's on ObjectContext][3]. So it was easy to expose it directly from [DbContext][4], because it has [ObjectContext][5] under the hood (you can access it via [IObjectContextAdapter][6]).

```csharp
public static string CreateDatabaseScript(this DbContext context)
{
	return ((IObjectContextAdapter)context).ObjectContext.CreateDatabaseScript();
}
```

Hope the questioner will find this blog post.

[1]: {% post_url 2011-04-20-232308-gopas-teched-2011-me-prednasky %}
[2]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[3]: {% post_url 2009-09-19-230810-first-touches-on-code-only-in-ef4 %}
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.103).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.data.entity.infrastructure.iobjectcontextadapter(v=vs.103).aspx