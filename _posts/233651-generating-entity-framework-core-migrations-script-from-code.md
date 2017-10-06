---
title: |-
  Generating Entity Framework Core Migrations script from code
date: 2017-10-06T09:09:00Z
tags:
  - Entity Framework Core
---
Creating script for migrations in command line is easy. Just execute `dotnet ef migrations script` and you're done. But what if you want to do this in the code?

<!-- excerpt -->

Executing migrations from code is easy, because there's directly a method for it: `DbContext.Database.Migrate`. Sadly, there isn't a direct method for creating a script. That doesn't mean it can't be done, of course. The important piece we need is implementation of `IMigrator`. Once we have it it's easy again thanks to the `GenerateScript` method. 

```csharp
var script = db.GetService<IMigrator>().GenerateScript();
```

I suppose this scenario is not common enough, thus some plumbing is required. On the other hand it's probably even easier than in Entity Framework 6.