---
title: |-
  Entity Framework 6 with Firebird updated
date: 2014-07-28T09:49:00Z
tags:
  - C#
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - .NET
layout: post
---
With [today's release of .NET provider for Firebird][1] the [Entity Framework][2] (version 6) support got even better. But given we're 3<sup>rd</sup> party provider, there's always some steps involved. I created a sample project that shows both approaches to working with Entity Framework - Code First manually and EDMX using wizard (or course you can mix these two together too).

<!-- excerpt -->

Let's start with Code First. First you need to install `EntityFramework.Firebird` package. This package will install all the related dependencies and modifies `[app|web].config` for Entity Framework + Firebird love. It's good to run `update-package` to get latest versions of packages. You're ready to start coding. Almost. Depending on your system setup you might not have a `DbProviderFactories` record in your (mostly) `machine.config`. That's easy to fix. Just add following lines into your `[app|web].config` (you can also add `remove` element if you want to have it on both places or you're not sure). 

```xml
<system.data>
  <DbProviderFactories>
      <add name="FirebirdClient Data Provider" invariant="FirebirdSql.Data.FirebirdClient" description=".NET Framework Data Provider for Firebird" type="FirebirdSql.Data.FirebirdClient.FirebirdClientFactory, FirebirdSql.Data.FirebirdClient"/>
  </DbProviderFactories>
</system.data> 
```

That's it. Nothing scary, right?

Now the EDMX. I suppose you have [DDEX provider for Firebird][3] installed and working. You again need to install `EntityFramework.Firebird` package and run `update-package` to get latest versions of packages. Now make sure the `FirebirdSql.Data.FirebirdClient` your DDEX installation is using (the one you have in GAC and have configured in `machine.config`) is the same as you have in project. Else the puppy dies. Make sure your project builds and build it. Then you can start adding EDMX as you're used to. 

And that's it. I would say making EDMX work needs same amount of work as Code First, but it's more about checking stuff than changing.

If you'd like to see the both methods in action, check the [`EF6_Firebird` repository][4]. Code First "just works". For EDMX you need to make sure your DDEX provider for Firebird is installed and working.

[1]: {% include post_id_link id="233471" %}
[2]: http://msdn.com/ef
[3]: http://www.firebirdsql.org/en/additional-downloads/
[4]: https://github.com/cincuranet/EF6_Firebird