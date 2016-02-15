---
title: "How to show SQL command created by Entity Framework?"
date: 2008-05-26T14:02:00Z
tags:
  - .NET
  - Entity Framework
  - LINQ
redirect_from: /id/227674/
category: none
layout: post
---
> [Updated version.][1]

Sometimes you may need to look at the command, that's created from your i.e. LINQ query and sent to database. Let's say you have query like this:

```csharp
var q = from m in e.master select m.t.Length;
```

You can cast the q into ObjectQuery and use the [ToTraceString][2] method to see the query:

```csharp
Console.WriteLine(((ObjectQuery)q).ToTraceString());
```

This will show you the query, that's sent to store you're using (mainly relational database). Neat and easy.

[1]: {{ site.url }}{% post_url 2012-11-14-233077-how-to-show-sql-command-created-by-entity-framework-2012-edition %}
[2]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectquery.totracestring.aspx
