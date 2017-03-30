---
title: |-
  EFv4 CTP5 some missing features (mapping)
date: 2010-12-16T10:11:31Z
tags:
  - Entity Framework
layout: post
---
[Entity Framework v4 CTP5][1] added some new nice features since [CTP4][2], for example the [DbSet<T>.Local property I was blogging about][3] or [Validation][4]. But, sadly, there's something missing, mainly due to huge refactoring.

I hit the wall with one in particular. It's entity splitting together with TPH inheritance. If you try to map it, you'll get `Entity splitting cannot be specified for type '<entity type>' since it is part of an inheritance hierarchy.`. Bummer. So one of the projects I'm working on now, is stuck in CTP4. :)

On the other hand, the good news (from reliable source ;)) is, that in RTM this will be working fine.

[1]: http://www.microsoft.com/downloads/en/details.aspx?FamilyID=35adb688-f8a7-4d28-86b1-b6235385389d
[2]: http://www.microsoft.com/downloads/en/details.aspx?FamilyID=4e094902-aeff-4ee2-a12d-5881d4b0dd3e
[3]: {% post_url 2010-12-09-232210-dbset-t-local-property-efv4-ctp5 %}
[4]: http://blogs.msdn.com/b/adonet/archive/2010/12/15/ef-feature-ctp5-validation.aspx