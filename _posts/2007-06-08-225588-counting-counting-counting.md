---
title: "Counting, counting, counting ..."
date: 2007-06-08T19:03:00Z
tags:
  - Databases in general
redirect_from: /id/225588/
category: none
layout: post
---
OK, not so describing title, but ...

A few days ago, when I was talking with my colleague, and discovered interesting fact that some people doesn't know about `count` function behavior in several cases. Let me show small example.

Create database on your favourite server. Then create simple table, something like `create table test (id int);`. Insert some data (`null` values too). Now try to execute these two statements: `select count(*) from test;` and `select count(id) from test;`. Wow! You got different results.

In fact it's not so wow how it looks like. Yep, `count(*)` counts null values too but `count(some_column)` counts only not null rows (not null in this column). And it's obvious. The `count(*)` has no idea whether to count rows, where first column is null and all others not or last is null and others not or ... who knows. But when you specify column name, then this is straightforward.

I hope this isn't new for you. ;)
