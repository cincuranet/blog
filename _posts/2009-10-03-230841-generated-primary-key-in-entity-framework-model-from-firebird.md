---
title: "Generated primary key in Entity Framework model from Firebird"
date: 2009-10-03T12:14:05Z
tags:
  - Entity Framework
  - Firebird
  - LINQ
layout: post
---
Firebird doesn't have identity/autoincrement columns like i.e. MS SQL or MySQL. Firebird has concept of generators/sequences (as know i.e. in Oracle). This is more powerful concept, but comes also with drawbacks, because you can't i.e. say for sure, whether the column values is generated or not. This is causing problems, if you set [StoreGeneratedPattern][1] in your model manually and then updated model from database - it's lost. Because this can be big pain in the ass, FirebirdClient can now report the column as "Identity" if you give it little help.

If you put into comment of column `#PK_GEN#`, then FirebirdClient will report it as generated primary key, resulting in StoreGeneratedPattern to be set to "Identity". Hence you don't have to every time manually change the model and easily use automatic fetching of the value from database when saving changes. If you wanna test it, grab build from [weekly builds][2].

[1]: http://msdn.microsoft.com/en-us/library/bb738536.aspx
[2]: http://netprovider.cincura.net