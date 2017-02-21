---
title: |
  NuoDB for .NET takes another step
date: 2014-05-01T13:28:00Z
tags:
  - NuoDB
  - Entity Framework
  - LINQ
layout: post
---
We will soon be releasing NuoDB 2.0.4 and this release will include support for the latest ADO.NET provider. As the ADO.NET world evolves, especially the Entity Framework (EF), we here at NuoDB are not standing by but are moving the driver forward as well.

<!-- !excerpt -->

We already have very good support for the standard ADO.NET interface and also Entity Framework 4 and 5 in the current version of the product. With 2.0.4 we are adding support for EF 6.x. EF 6 is a major step forward. The Entity Framework team added a lot of feature enhancements, which are [listed][1] on the Microsoft .Net Entity Framework wiki. If you want to use EF 6 with NuoDB you should install the [EntityFramework.NuoDb package from NuGet][2]. The package automatically registers connection factory and provider (provider services) in app.config (or web.config) for you. The rest doesn't differ a bit from using EF 6 with MS SQL Server or any other SQL database (of course taking into account NuoDB's unique distributed database features).

In fact the latest version of Entity Framework is 6.1.  This version also includes consolidated tooling (EDMX and Code First) with some of the features that were available before in EF Power Tools. We tested support for EF 6.1 just before it was released as well and fixed a few issues that the new tooling surfaced. Hence it's not a false statement to say that NuoDB 2.0.4 will have support not only for EF 6 but also 6.1.

Some of you might remember that somewhere around September of last year we took a challenge and added support for NuoDB in nopCommerce ([here][3] and [here][4]). nopCommerce is an e-commerce solution based on C#, ASP.NET and Entity Framework (to name the main building blocks). It was a great test of our ADO.NET driver. Of course nopCommerce is moving forward as well and the current version 3.30 uses EF 6.

So why wouldn't we test our ADO.NET driver again in conjunction with nopCommerce 3.30? We had the same question in our head but you don't have to. If you check [our repository with nopCommerce's port][5] you will be able to download nopCommerce 3.30 working with NuoDB. Done. In fact we were quite happy with current status of our driver because all the work involved was adding NuoDB 2.0.4 database support to nopCommerce and no other changes were needed in the driver. And most of nopCommerce's code was untouched (read: no hacks ;)).

We encourage you to try our new ADO.NET driver (feedback is welcome). And also if you want to see it in action in a non-trivial application we recommend giving a [nopCommerce][5] try.

> Written for [NuoDB's Techblog][6].

[1]: https://entityframework.codeplex.com/wikipage?title=specs
[2]: https://www.nuget.org/packages/EntityFramework.NuoDb/
[3]: http://dev.nuodb.com/techblog/nopcommerce-nuodb-%E2%80%93-part-1
[4]: http://dev.nuodb.com/techblog/nopcommerce-nuodb-%E2%80%93-part-2
[5]: https://github.com/nuodb/nopCommerce
[6]: http://dev.nuodb.com/techblog/connection-pooling-net-and-nuodb