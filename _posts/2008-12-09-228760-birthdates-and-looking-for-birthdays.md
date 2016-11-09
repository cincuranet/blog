---
title: "Birthdates and looking for birthdays"
date: 2008-12-09T22:34:00Z
tags:
  - Databases in general
  - Firebird
layout: post
---
Today there was a question in [db section][1] in [builder.cz][2] forum. In essence, how to show people having birthday today or in couple of days if I have a birthdate. Well the solution I'll show you here is in Firebird syntax, but shouldn't be a problem to rewrite it to any other platform you like.

So the solution is like this (of course, you can find many other ways how to solve it):

```sql
select dateadd(year, datediff(year, birthdate, current_date), birthdate) from
(
select cast('1.2.1993' as date) as birthdate from rdb$database
);
```

OK, what's the idea behind. First step is to get difference between these dates in year. Then, using the dateadd function to prevent some mismatch in date arithmetics (i.e. leap years), to add this difference to birthdate. Now you have it in "current year", so it's easy to test whether it's between today and today + x. To improve speed, you can create computed index for this expression.

[1]: http://forum.builder.cz/list.php?21
[2]: http://www.builder.cz/