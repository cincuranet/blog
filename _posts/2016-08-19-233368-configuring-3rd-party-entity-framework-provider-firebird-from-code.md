---
title: "Configuring 3rd party Entity Framework provider (Firebird) from code"
date: 2016-08-19T14:04:00Z
tags:
  - Entity Framework
  - Firebird
  - NuoDB
redirect_from: /id/233568/
layout: post
---
When you're using Entity Framework 6 with some 3rd party provider - i.e. [EntityFramework.Firebird][1] or [EntityFramework.NuoDb][2] (disclaimer: I'm author of both) - you need to give Entity Framework few hints where to find some methods and classes. Maybe you've seen classes like `DbProviderFactory` or `DbProviderServices`. Often when you install the provider, your `app.config` is updated accordingly. But you might want to do it in code. Either because you want to to have it strongly typed or because you don't want to think about what project, that's using the DAL project, is going to be executed and so on.

<!-- excerpt -->

Unsurprisingly the `app.config` is not the only option where you can do such configuration. You can create a class that inherits from [`DbConfiguration`][3] and do the same there. And not only this, although I'll focus only on task currently in hand.

The classes mentioned above were not random choice. The fact is these two you need to configure (if you provide [`DbConnection`][5] to your [`DbContext`][4]). Thus for, for example, _Firebird_ you can put these two lines into the constructor.

```csharp
SetProviderServices(FirebirdSql.Data.EntityFramework6.FbProviderServices.ProviderInvariantName, FirebirdSql.Data.EntityFramework6.FbProviderServices.Instance);
SetProviderFactory(FirebirdSql.Data.EntityFramework6.FbProviderServices.ProviderInvariantName, FirebirdSql.Data.FirebirdClient.FirebirdClientFactory.Instance);            
```

The `ProviderInvariantName` field is a constant `"FirebirdSql.Data.FirebirdClient"`, so you don't have to type it yourself and be sure the classes are matching the provider.

Finally put the [`DbConfigurationType` attribute][6] on your context and specify the name of `DbConfiguration` class you created above.

And that's it. Just a few lines of code and the DAL project is now self contained without the need to have some external configuration. 

[1]: https://www.nuget.org/packages/EntityFramework.Firebird
[2]: https://www.nuget.org/packages/EntityFramework.NuoDb
[3]: https://msdn.microsoft.com/en-us/library/system.data.entity.dbconfiguration%28v=vs.113%29.aspx
[4]: https://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.113).aspx
[5]: https://msdn.microsoft.com/en-us/library/system.data.common.dbconnection(v=vs.110).aspx
[6]: https://msdn.microsoft.com/en-us/library/system.data.entity.dbconfigurationtypeattribute(v=vs.113).aspx