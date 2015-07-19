---
title: "Implicit lazy loading on by default in EF4"
date: 2009-11-08T22:09:54Z
tags:
  - Entity Framework
redirect_from: /id/231012/
category: none
layout: post
---
The last beta (Beta 2) of Visual Studio 2010 with EF4 contains one "interesting" change. The implicit lazy loading is turned on by default. And I'm not sure I like it.

I can handle the fact, that there was a strong demand for it (as [Julie pointed][1]) and that for LINQ to SQL people or beginners this may be much easier. But from a database guy perspective this is hidden evil, especially if you're not the only one developer in project. You don't know when you're hitting the database and maybe worse, everything seems to be working fine (all data are there), but it's a performance problem when you deploy the application from local/test environment. And how surprising will it be, when the context will be gone.

Maybe I change my opinion after trying to work with it. But now, I'll rather use eager loading or I'll be explicit with my calls to database. To be on safe side. What do you think?

[1]: http://thedatafarm.com/blog/data-access/ef4-lazy-loading-on-by-default-but-what-about-pre-beta-2-models/#comment-1694