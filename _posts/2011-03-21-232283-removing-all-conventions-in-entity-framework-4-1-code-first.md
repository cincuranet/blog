---
title: "Removing all conventions in Entity Framework 4.1 Code First"
date: 2011-03-21T18:03:52Z
tags:
  - Entity Framework
redirect_from: /id/232283/
category: none
layout: post
---
Convention-over-configuration is great, at least for a quick start, in my opinion. But if you're like me and you want everything under your control, you may want to remove all (at least those you can remove via code).

Because now there's no list available (based on RC version, but very probably it'll be same in RTM) as it was in i.e. CTP5 you need to kind of get all items implementing `IConvention` interface. And because I want my code work no matter what will be added or removed in next versions, I'm not going to hardcode these. Couple of lines with reflection and we're done.

```csharp
MethodInfo method;
method = typeof(ConventionsConfiguration).GetMethod("Remove");
foreach (var convention in Assembly.GetCallingAssembly()
	.GetTypes()
	.Where(t => t.Namespace == "System.Data.Entity.ModelConfiguration.Conventions" || t.Namespace == "System.Data.Entity.Infrastructure")
	.Where(t => t.GetInterface("IConvention", false) != null && !t.IsInterface && !t.IsAbstract))
{
	method.MakeGenericMethod(convention).Invoke(modelBuilder.Conventions, null);
}
```

I'm simply looking into `System.Data.Entity.ModelConfiguration.Conventions` namespace, where all the "I-do-the-mapping-for-you" conventions are and also `System.Data.Entity.Infrastructure` namespace, where the default database creation etc. stuff lives. The code is in overridden `OnModelCreating` method.

Now you can explore what one must do to create proper mapping by hand. :)
