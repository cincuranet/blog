---
title: |-
  Zooming in Entity Data Model Designer - pain for source control
date: 2009-04-03T07:38:00Z
tags:
  - Entity Framework
---
From the beginning, when we discovered, that the EDMX file contains also section for design time stuff we knew, that it's not the best for source control systems (i.e. Subversion). Yesterday I found another nasty feature. Even if you're not moving entities in designer, changing zoom is also saved into the file. Can the collision making be easier?

Couldn't help but wonder, why is zoom number saved? Maybe then the scroll position could be saved too. :)

I hope in next versions of VS the designer stuff and model itself will be split. Or you can use [EdmGen2][1] and commit only CSDL, MSL, SSDL files and use EDMX just for changing stuff in VS.

[1]: {% include post_link id="227892" %}