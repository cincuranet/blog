---
title: |-
  Complex types and stored procedures - 2nd edition
date: 2010-02-28T15:28:27Z
tags:
  - Entity Framework
  - Visual Studio
---
Some time ago I was [writing about not supported scenario when you have entity with complex type and you want to map result of stored procedure to this entity][1]. I couldn't believe that this, from my point of view fairly common, scenario will not be supported in designer in RTM.

Right now I'm running RC of Visual Studio 2010 (the development probably in feature freeze mode) and the limitation is still there. :( Jeff Derstadt was absolutely right, unfortunately. Although Zeeshan Hirani in [forum][2] said, he was able to do it manually, it's uncomfortable. Same as complex types in EFv1.

Looks like complex types, sadly, are still not first class citizens for designer.

[1]: {% include post_link id="231207" %}
[2]: http://social.msdn.microsoft.com/Forums/en-US/adonetefx/thread/528d6d79-e8d8-4db7-86c9-0aa2d29dca08/