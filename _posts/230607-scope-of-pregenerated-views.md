---
title: |-
  Scope of pregenerated views
date: 2009-06-26T19:38:23Z
tags:
  - Entity Framework
---
Pregenerating views can speed up startup time of you application. You may find more info in my [previous post about it][1]. On the other hand, setting up this for all developers or i.e. build machine can be tricky. Thus it may be worth to think whether it's for you or not.

One reason not to pregenerate these views (besides laziness ;)) could be, that your application is long running (i.e. windows service or ASP.NET app (I'm not IIS and ASP.NET guru so I hope this is also the case)) and if these views would be cached in smart way, application will be benefit from it even without pregenerating.

Good news. These bi-directional views are cached per appdomain. So if you don't care about startup time and your application is long running (in one appdomain) you don't have to care about setting up all the stuff [described in the article][2].

[1]: {{ include "post_link" 228787 }}
[2]: {{ include "post_link" 228787 }}