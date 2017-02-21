---
title: |
  NuoDB's .NET driver on NuGet
date: 2013-11-01T10:28:00Z
tags:
  - NuoDB
  - NuGet
layout: post
---
This year while I was helping [NuoDB][1] to [improve Entity Framework support in their driver][2] I had in my head that the [NuGet][3] package for driver would be nice. But you know, ..., time flies.

<!-- excerpt -->

Today the same idea popped in my head again and I decided to quickly jump into and create the package. The driver is part of the NuoDB's installation, so I just used these binaries - because these are official - and created simple pacakge. Just the driver, nothing more. The package is called `NuoDb.Data.Client` same as the namespace where the code lives.

Head to [NuoDb.Data.Client's NuGet page][4] and download, install, enjoy.

[1]: http://www.nuodb.com
[2]: {% post_url 2013-08-01-233385-nuodbs-ado-net-driver-and-entity-framework %}
[3]: http://www.nuget.org
[4]: http://www.nuget.org/packages/NuoDb.Data.Client/