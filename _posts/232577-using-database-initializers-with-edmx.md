---
title: |-
  Using database initializers with EDMX
date: 2011-11-21T18:02:42Z
tags:
  - Entity Framework
---
Last week at my Entity Framework training I got a question whether you can use database initializer while still using EDMX file. The answer, as it turned out, isn't that straightforward.

Directly you can't. Because you need [DbContext][1] to create [IDatabaseInitializer<T>][2] (or to derive from default ones respectively). Even if you try to wrap [ObjectContext][3] into `DbContext` you'll fail. The default objects are derived from [EntityObject][4]s and this is something that's a showstopper for `DbContext`. So that's a bad news.

On the other hand, there's a good news, kind of. There's a template (from Microsoft) to generate `DbContext` and classes from EDMX file.

![image]({{ include "post_ilink" page "dbcontext_t4_template_item.png" }})

With this template you will get all you need to start using database initializers. Only problem is, that you don't have configurations generated from EDMX. But there's also 3^rd^ template, that can generate configurations (I haven't tested it exhaustively).

Final answer? Yes you can, but it's not smooth as it could be.

[1]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.103).aspx
[2]: http://msdn.microsoft.com/en-us/library/gg696323(v=vs.103).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.entityobject.aspx