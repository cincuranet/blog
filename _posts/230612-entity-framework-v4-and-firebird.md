---
title: |-
  Entity Framework v4 and Firebird
date: 2009-06-27T16:41:56Z
tags:
  - Entity Framework
  - Firebird
  - LINQ
---
The Beta 1 of Entity Framework v4 ([confused with versions?][1]) is out for a while and you may be tempted to check the new features comming. And why not with Firebird.

Good news is, that there's no breaking change right now I'm aware of. Hence you can easily jump into VS2010, [install DDEX][2] and test it. Of course, some new features are now not fully functioning as it's beta and/or because it's not nailed down for provider writers (i.e. DDL script generation). But as far as something will be ready, I'll try my best to get it into Firebird's provider.

On the other hand, even the new singularize/pluralize function is nice and works with all databases, you still get all names in uppercase, only the added suffixes are lowercase. And that looks even more weird. You can fix it yourself manually or [let computer do the work][3], but still wondering why there isn't any option to fix this (as uppercased name is default when not quoted according to SQL standard).

Anyway, if you found any problems with EF4, let me know.

[1]: http://thedatafarm.com/blog/data-access/ef4-ef4-ef4/
[2]: {% include post_link, id: "228661" %}
[3]: {% include post_link, id: "228749" %}