---
title: "Binding Boolean fields from Firebird"
date: 2007-07-02T09:32:00Z
tags:
  - .NET
  - Firebird
layout: post
---
From time to time there's a question about binding bool fields from Firebird into DataSet/DataTable. Because Firebird has no bool datatype people created a lot of workarounds. The most used way is to use CHAR(1) or SMALLINT as base type (or domain with check constraint). With integer, there's no problem. When you have 0/1 False/True it's trivial. But how to do this with char (or any other way you're using). Well, the solution is easy. I like this one.

I create select, that returns true/false as 1/0 directly. Using CASE statement is really helpful. This solution has minimal overhead and can be used with any datatype you're using as bool. For fine-tunning you can create a view or stored procedure (for select or only for returning 0/1 values from your type).

IMO this solution pretty easy and straightforward. You can use it with Fb... objects directly or with DDEX generated without any problem.