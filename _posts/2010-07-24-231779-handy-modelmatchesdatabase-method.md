---
title: |-
  Handy ModelMatchesDatabase method
date: 2010-07-24T13:12:45Z
tags:
  - Entity Framework
layout: post
---
The [Entity Framework 4 CTP4][1] is out and contains nice improvements. One is especially handy. Well you was able to do the same even in v1 but it was a lot of work. The method is `ModelMatchesDatabase` in `System.Data.Entity.Infrastructure.Database`. You can get `Database` object easily through `DbContext.Database`. The method return boolean value and checks whether your database matches mapping or not.

Only not useful thing is the `EdmMetadata` table the whole infrastructure is using. I know it's easier with it, but could be done without as well. I hope will be removed (or be optional) in future CTPs or final releases. Because then you'll be able i.e. check that your mapping is valid for selected database, check that your database has expected structure from application's point of view (i.e. after new release) or simply spin up you own custom database altering process and check results.

[1]: http://www.microsoft.com/downloads/details.aspx?displaylang=en&FamilyID=4e094902-aeff-4ee2-a12d-5881d4b0dd3e