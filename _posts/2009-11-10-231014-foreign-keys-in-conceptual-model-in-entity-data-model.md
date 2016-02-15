---
title: "Foreign keys in conceptual model in Entity Data Model"
date: 2009-11-10T08:08:01Z
tags:
  - Databases in general
  - Entity Framework
redirect_from: /id/231014/
category: none
layout: post
---
When I first heard about exposing foreign keys in conceptual model I was getting crazy. It's the object world, you shouldn't think this way, in a relational world. On the other hand, working purely in objects can be a pain, especially in web development, and performance problem. Sure, foreign keys can solve you some "problems" (and maybe [add some][1]) without tweaking the [EntityKey][2] or doing stub entities. Which is hard when dealing with [POCO][3].

But is this a really way to go? Exchange cleanness for comfort.

I don't know. I was doing the EntityKey magic, and it was magic, because it was not clean. Now I can do it easily, but. For POCO it's harder, as there's no EntityKey, but again, you have plain objects - why to deal with foreign keys? What if you move to some non-relational store?

But still one piece is left. The M:N association. Here I cannot use any foreign key, so it's back to hacking or pure objects. And maybe this is the point. If creating some kind of comfort here for developers, why not to find some way for complete story? Wouldn't it be nice?

Now I know (see how good is trying to write your own ideas). I don't like the current concept of FKs. It's too easy, and just too replicating behavior of relational world. But if there would have been some improvement for the other types of associations to cover all types in uniform way, I would vote for it with both my hands. Although still saying that it's not nice but acceptable, as relational databases - it seems - will be with us for sure next couple of years.

[1]: http://blogs.msdn.com/alexj/archive/2009/11/01/tip-39-how-to-set-overlapping-fks-ef-4-0-only.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.entitykey.aspx
[3]: http://en.wikipedia.org/wiki/Plain_Old_CLR_Object
