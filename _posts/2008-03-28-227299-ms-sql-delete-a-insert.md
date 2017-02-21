---
title: |
  MS SQL delete a insert
date: 2008-03-28T19:16:00Z
tags:
  - Databases in general
layout: post
---
MS SQL je divnej :) [tak, to to schytám]. Přepisoval jsem něco do Entity Frameworku pro Firebird ze samples, kde se samozřejmě pracuje s MS SQL. Ačkoli specifikace SQL (SQL'92) hovoří jasně o tom, jak má vypadat insert a delete statement, MS SQL musí mít něco extra (a určitě to má super důvod).

Insert je definován jako "INSERT INTO <table name> <insert columns and source>" MS SQL vesele pobere i verzi bez "INTO". Podobně jako delete (s podmínkou) je definován "DELETE FROM <table name> [ WHERE <search condition> ]" MS SQL opět vesele pobere i verzi bez "FROM".

Technicky vzato to může být jedno, každá DB má své nuance. Nicméně tyto základní věci by podle mě, mohly být stejné - už jen aby to každý dokázal lehce přečíst, vzít a použít jinde. Ale třeba jsem moc upjatý ...