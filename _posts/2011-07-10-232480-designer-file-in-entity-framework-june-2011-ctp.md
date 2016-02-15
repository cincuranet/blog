---
title: "Designer file in Entity Framework June 2011 CTP"
date: 2011-07-10T09:31:12Z
tags:
  - Entity Framework
redirect_from: /id/232480/
category: none
layout: post
---
There's a lot of new stuff coming with the [Entity Framework June 2011 CTP][1] - enums and spatial types and ... you can find it all around blogosphere. And for sure, I'll cover my finding as I'll dive into it. But there's one, one could call it very minor, improvement, that was in, my opinion, pain in the ass.

Previously, the designer settings, like positions of lines for associations, sizes of entities and even zoom level were stored directly in EDMX file. Hence possibly creating changes in it even if you only read it. But the new CTP solves it. The designer's content is now in a separate file. So if you're about to commit to [VCS][2] you can much better see what was really changed - whether then model itself or only the designer (and you can ignore designer changes if you want).

![image]({{ site.url }}/i/232480/ef42_junectp_designerfile.png)

Nice isn't it? Pity that this "bug" made it to the first release. 8-)

[1]: http://blogs.msdn.com/b/adonet/archive/2011/06/30/announcing-the-microsoft-entity-framework-june-2011-ctp.aspx
[2]: http://en.wikipedia.org/wiki/Revision_control
