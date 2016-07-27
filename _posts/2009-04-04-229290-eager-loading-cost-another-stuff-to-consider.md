---
title: "Eager loading cost - another stuff to consider"
date: 2009-04-04T20:20:00Z
tags:
  - Databases in general
  - Entity Framework
redirect_from: /id/229290/
layout: post
---
Julie Lerman made a great post about [The cost of eager loading in Entity Framework][1]. And everything there is true, in fact if you take [my Entity Framework training][2], you will know that with all reasons and you'll also learn performace improvements you may incorporate into your solution.

I want to make some small addition to this post. There's another stuff to think about. That's the cost of processing query on server.

You should always consider the cost of parsing, compiling, finding execution plan etc. the query on server as well as fetching the intermediate data (which may cause cleaning up caches etc.). Thus sometimes (and we're back to balance as Julie said) it's better to issue couple of smaller (not so complex) queries, rather than one huge query.

[1]: http://www.thedatafarm.com/blog/2009/03/30/TheCostOfEagerLoadingInEntityFramework.aspx
[2]: {{ site.address }}/about/