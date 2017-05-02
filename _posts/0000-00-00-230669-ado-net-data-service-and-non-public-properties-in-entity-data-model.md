---
title: |-
  ADO.NET Data Service and non-public properties in Entity Data Model
date: 2009-07-02T10:45:42Z
tags:
  - Entity Framework
  - OData/Data Services (Astoria)
layout: post
---
I was punch directly to my face right now. Everytime I'm doing some ADO.NET Data Services (Astoria) speak I'm showing simple models, with almost no modifications. And everything works great. But I found, right now, that if you have entity in your model with property access getter or setter setted to anything except public, the service will not work. Grrr.

I understand that hiding setter causes the updates or inserts to stop working. But why the getter? If I limit my entity set to i.e. [AllRead][1], then the querying should just work. Hmm, it's probably related to [missing select support][2] (in 3.5SP1 as well as 4.0).

Anyway it was really "interesting" ;) to find this out.

[1]: http://msdn.microsoft.com/en-us/library/system.data.services.entitysetrights.aspx
[2]: {% include post_link id="230674" %}