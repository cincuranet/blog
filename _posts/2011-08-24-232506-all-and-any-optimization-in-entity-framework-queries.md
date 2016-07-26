---
title: "All and Any optimization in Entity Framework queries"
date: 2011-08-24T06:55:58Z
tags:
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - LINQ
redirect_from: /id/232506/
category: none
layout: post
---
When I'm teaching my Entity Framework trainings, I'm always begging to look, at least from time to time or when you see the query looks complex, to generated SQL statement. And if you have (near to) real data, also execution plan. Although Entity Framework helps you with standard data access layer, it's not magic – the query translation is complex process and sometimes what you capture in LINQ query isn't exactly how you'd express it in SQL. You simply have different concepts in LINQ vs. in SQL.

Last week I was writing some decision algorithms based on data and I was accessing it, of course, using Entity Framework. Because the conditions we're complex I was writing these as it came from my head to my fingers. The day after I was writing similar condition, only one or two options negated and I wrote it differently. Basically I was swapping `All` and `Any` methods. These two are interchangeable, if you change conditions accordingly.

As an example let's have and condition: "All apples are green." aka "`All(apple => apple.Color == Green)`". But you can also say "No (any) apple is non-green." aka "`!Any(apple => apple.Color != Green)`".

Now the magic comes to play. You might think, well, if it's interchangeable, then it's good, as Entity Framework can always utilize `EXISTS` predicate from SQL. For simple queries maybe. But if you think about various places where the condition can occur and how easy is to negate the condition you immediately have a lot of problems in front of you. Add to this database engine optimized, where it can or can't use properly indices, reorder conditions to create smaller intermediate result sets etc. A lot of places where the machine needs to (try to) figure out what's best way of getting your data for you.

Sadly there's no rule of thumb, like always use `Any`. Only one good and 100% working advice is to always check the query and execution plan. But even with i.e. `All` the result could be absolutely fine.