---
title: "Subselects in computed columns in MS SQL"
date: 2009-05-03T20:28:00Z
tags:
  - Firebird
  - MS SQL Server
redirect_from: /id/230136/
layout: post
---
I found nice hack on MS SQL. On Firebird I'm using sometimes computed column(s) with select in definition. It can be performance (or concurrency) problem, but if you use it carefully it's helpful. And I was missing this feature on MS SQL. But accidentally I found solution/workaround.

You can create a function, that will do the select and return the value you need. The only problem is, that you're creating dependency between the column and the function. 

You can create function for instance:

```sql
create function FooBar
(
  @ID int
)
returns bit
as
begin
  declare @result bit;
  if /* some code with (sub)select */
  begin
    set @result = 1;
  end
  else
  begin
    set @result = 0;
  end
  return @result;
end
```

And use it in column for table (it's just example ;)):

```sql
alter table Foo add Bar as (case when dbo.FooBar(ID) = 1 then 'foo' else 'bar' end);
```

Not nice as in Firebird where you can just use the select, but works. I haven't measured any performance hit, but sure there will be some slowdown. But if you really need it ... :)