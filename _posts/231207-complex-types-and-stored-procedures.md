---
title: |-
  Complex types and stored procedures
date: 2010-01-31T15:52:11Z
tags:
  - Entity Framework
  - Visual Studio
---
I like the idea of [complex type][1]. Sadly the designer didn't supported complex types in EFv1/VS2008, although you could use it manually editing the model (it's just a XML file). The designer in EFv2/VS2010 supports complex types (and you can use it also with EFv1, [see this][2]) hence it's time to start really using these.

Unfortunately nothing is perfect. As far as you don't wanna map some stored procedure result to collection of entities, then the designer will tell you, that it's not supported. :( And Jeff Derstadt pointed in [forum][3] that this limitation will not be solved in RTM.

I'm using EFv4 in my current project and thanks to ability to map functions directly to LINQ functions via [EdmFunction][4] attribute I was able to to a lot of work via functions and queries created by EF itself. But I always feel a little bug in my head saying "What if you'll need it later?". Sure I can redo all back into direct properties, but if it's close to the end of the project it's pretty expensive to do it.

What a pity, I see complex types as a good concept, but I'm too careful to close myself the path with SPs.

[1]: http://msdn.microsoft.com/en-us/library/bb738472.aspx
[2]: http://thedatafarm.com/blog/data-access/leveraging-vs2010-rsquo-s-designer-for-net-3-5-projects/
[3]: http://social.msdn.microsoft.com/Forums/en-US/adonetefx/thread/528d6d79-e8d8-4db7-86c9-0aa2d29dca08/
[4]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.edmfunctionattribute(VS.100).aspx