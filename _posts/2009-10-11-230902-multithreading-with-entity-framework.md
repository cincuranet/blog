---
title: "Multithreading with Entity Framework"
date: 2009-10-11T16:27:33Z
tags:
  - Entity Framework
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/230902/
category: none
layout: post
---
From time to time I get a question about using ObjectContext from more than one thread. Because Entity Framework sits on top of ADO.NET, it's obvious, it cannot be thread safe. So if you need to use `n` threads, use `m` (where `m>=n`) ObjectContexts. That's the easy way. But what if you really need to share ObjectContext between threads?

The first fact is, that you cannot run more statements at a time, because it will sooner or later create mess in provider. So the solution is to carefully lock the usage. Not good for scaling, but you can do (almost) nothing with it.

Another basic issue is that with IQueryable (if you're using LINQ) you don't know, when the query gets actually executed. Until somebody calls for example ToArray, it's just a definition/shape of the query. And when it gets executed, the code can be out of your method or out of the lock. For sure. The composition will be affected little bit. You can create a rule, that everything you'll be exposing to UI (or any higher level) developers will be for instance List<T>. Then you will probably need to prepare significant amount of methods, for almost every data projection, selection, ... they need. Good news is, that you can hide (make i.e. internal) the original methods, and nobody will screw up something.

Maybe better option is to create simple method taking complete query as parameter and returning the data i.e. as IEnumerable (simply saying, fetched from database). This is good, but everybody has to be attentive, using only this method (it will be generic, so it may look little weird using it with anonymous type, but works and you can find something about it looking for "cast by example" using your favourite search engine). As a good side-effect, you can add easily add i.e. logging of queries being sent to the database from application.

Stored procedures are executed immediately (are not composable), thus you can just create simple wrapper around it with lock. Easy.

The rest is  saving changes. The [SaveChanges method is virtual in EFv4][1], so your own implementation with lock will be easy (and you can use T4 templates for ObjectContext to make the code with lock right from generator). In EFv1, the story is similar as with querying. Create separate method and tell everybody use only this one or swat the original over with your own using new keyword.

Last topic that's in my head right now, is working with entities in code - changing properties (don't forgot associations). If one entity will be edited in more than one thread, you may (or may not) confuse [ObjectStateManager][2] as the overlapping change tracking may kick in. To be on the safe side, I think avoiding this is best way - choose whatever you like for doing it (and take into account that one thread can be editing the entity and the other one refreshing it from store, for instance, so choose proper granularity of lock (or introduce some rules into your code/team ;))).

I don't know whether I cover all main basic stuff you can do with EF as I'm writing it from top of my head, bare with me and feel free to comment. And be it as it is right now, if there's 1% chance of being able to use separate ObjectContexts, do it. It will prevent you lot of headaches.

[1]: {{ site.address }}{% post_url 2009-06-30-230662-savechanges-is-virtual-in-ef4 %}
[2]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectstatemanager.aspx