---
title: |-
  Some nice ideas in stored procedures in NuoDB
date: 2013-08-27T06:33:42Z
tags:
  - Databases in general
  - NewSQL
  - NoSQL
  - NuoDB
  - Programming in general
  - SQL
layout: post
---
NuoDB recently released preview of stored procedures in version 1.2. You can read more in [this blog post][1]. As I was going though it I found some "syntax pieces" interesting. Kind of "modern", so it's not that `x` decades old SQL.

<!-- excerpt -->

First is variable declaration. Although you can do the standard way where you specify the variable name and type, you can also skip the type. Then there will be no checks, forgot about type inference.

```sql
var v1;
var v2;
```

But that doesn't matter. Often I use variables just to store values from select or insert and use it in another command. Here I don't care about types (as much as I like static typing). It's just to shuffle value between commands. And this brings me also to the other nice "syntax piece".

You know the time when you need to fetch some value(s) from select and use these. You'll basically end up with something like:

```sql
declare v1 int;
declare v2 int;
select col1, col2 from table into :v1, :v2;
```

But the syntax:

```sql
var v1;
var v2;
v1, v2 = select col1, col2 from table;
```

looks better to me. The variables are on left, values or expressions on right. Even the SQL assigns values to variables in this pattern. Only columns from selects, values from inserts etc. are traditionally "messed up". Nice touch. But I know, somebody may say it's not SQL-ish. :)

With selects and variables is also related "pattern" I do (and I think you do too) often:

```sql
declare v1 int;
declare v2 int;
for select col1, col2 from table into :v1, :v2 do
begin
	-- i.e. update using v1 and v2
end
```

And I hate it. If I have a select with a lot of columns I have to declare a lot of variables. Just to use these in `for ... begin ... end`. And have to declare types (see first point 8-)). Boring. But in NuoDB you can write:

```sql
for select col1, col2 from table
	-- col1 and col2 are directly accessible similarly to v1 and v2
end_for
```

Pretty sweet. You saved yourself a lot of typing (that honestly isn't needed as the engine can infer these information).

I have to say, somebody was thinking when designing this. There's still room for improvement – I don't like the `end_for`, for example; I think `begin ... end` is better (though in Bash I consider i.e. `if ... fi` pretty readable) – but it's still preview. What do you think?

[1]: http://dev.nuodb.com/techblog/nuodb-1-dot-2-sql-stored-procedures