---
title: "Stored procedures vs. indices and Entity Framework"
date: 2011-08-26T05:11:50Z
tags:
  - Databases in general
  - Entity Framework
redirect_from: /id/232512/
category: none
layout: post
---
Sometimes I came to discussion about Entity Framework not being able to use (map) particular stored procedure somebody wrote to do something very quickly and/or efficiently (kind of ;)). You know, it's boiling water for coffee, printing invoice and sending flowers to cafeteria girl down in a hall.

Not always this is a good optimization. Don't get me wrong, I like stored procedures, if used properly. But sometimes the solution is easier. More and more are people forgetting about indices. Something databases are very good at using. And not only using, also maintaining and defining and so on. Proper index in heavily used query can make it order of magnitude faster. Especially for huge tables (when on proper fields).

The conclusion? Don't immediately try to jump from sets and plain query definitions into imperative programming in stored procedures. Set operations are still very fast, database optimizers can do magic when it's just query definition and indices are in place. And it's way easier to live with index than to maintain stored procedure.
