---
title: "Is ORM just about bridging the gap or are we trying to wrongly match ER world into OO world?"
date: 2010-07-23T03:49:08Z
tags:
  - Databases in general
  - Programming in general
redirect_from: /id/231764/
category: none
layout: post
---
Recently I've got to think about ER world and OO world. There's a lot of people around there who understand ER or OO world very deeply. In fact ER world is well formalized, described and has a strong mathematical background. A lot of theoretical work is behind OO as well. But what about ORMs?

Is it about the fact we understand both worlds correctly and it's good we're trying to bridge them using the power of machines instead of our hands and brains all over again or the exact opposite? Trying to wrongly create something that automagically does this bridging even if the bridge itself will be bloated, slow and creating ugly results?

Have you ever seen query from Entity Framework, LLBLGen Pro, Hibernate, NHibernate, ..., name yours? Don't blame the tool. I think any of them is doing great job translating the query from some king of object oriented way of expressing what I want to i.e. SQL. The problem is, that we're not querying database, but objects mapped to database objects. Sometimes with very clever mapping. The tool then has to reason about some general transitions from objects to tables and then creating the query. Sure a room for improvement is here. But is it worth?

What other options do we have? Object databases (or post-relational)? Relational programming (probably not)? Maybe just the ORMs idea is wrong. Maybe the bridging is good, and we just need to start from the other end and do it differently. Maybe allow lower the abstraction for those who understand both worlds. And remember these worlds proved self to be very useful doing what they were designed to do. So we just need to find a way to work in both with less friction; or did we find it?