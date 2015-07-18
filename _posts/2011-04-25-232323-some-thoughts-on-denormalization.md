---
title: "Some thoughts on denormalization"
date: 2011-04-25T14:29:48Z
tags:
  - Databases in general
  - Firebird
redirect_from: /id/232323/
category: none
layout: post
---
From time to time I have an idea for helpful project I could do to help myself or people around me to finish some task faster/easier. And, of course, it often involves database. And though I'm a strong believer in normalization (3NF is a must), at least during initial design, sometimes I see this project being partly simple and partly I want it done in no time (because I'm doing it in my own spare time) I think about storing data denormalized and doing the work in application.

Classical variation is user and his/her permissions. It's a standard 1:N case (also might be M:N). The proper way is to create two tables and use foreign key to ensure data integrity. But often you feel it's not so crucial function and maybe you'll have less than five permissions, you think, storing it in column comma separated is good idea and will cut the time significantly.

You might be right. But you feel it's not correct. It's bad. It's not for future extending of application (and we all know it'll happen 8-)). Today I realized I can have all from both worlds - good design and quick development.

Design it normalized, because it's what you should do. But then you can create a simple view where you use some kind of "LIST" function (i.e. [Firebird][1] has exactly that named one). This view will create you denormalized form of data. With a small help from triggers you can also update that view hence underlying data ([left as an exercise for reader][2]).

```sql
select list(r, ',') from
(
  select 'r' as r from rdb$database
  union all
  select 'r' from rdb$database
  union all
  select 'r' from rdb$database
);
```

Because you write this only once (yes, probably you have to rename some table next time), for next "fun" project you're designing tables as it should be and because you have it already ready in tool-belt you have the ease of development too.

My head-split is solved. :)

[1]: http://www.firebirdsql.org
[2]: {{ site.url }}{% post_url 2011-05-03-232347-tokenize-string-in-sql-firebird-syntax %}