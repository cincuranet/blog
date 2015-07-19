---
title: "How dumb the instead of triggers on MS SQL are???"
date: 2009-07-23T14:29:45Z
tags:
  - MS SQL Server
redirect_from: /id/230777/
category: none
layout: post
---
Shortly: Very.

I hate the idea of instead of triggers and I made a couple of blog posts several times. And even worse is the implementation behavior on MS SQL. And the cascade constraints are bad too.

Let's suppose this simple definition.

```sql
create table master(id int primary key, foo nvarchar(20));
create table detail(id int primary key, id_master int not null, bar nvarchar(20));
alter table detail add foreign key (id_master) references master(id) on delete cascade;
```

Nothing special. Works fine, no problems expected. Until you try to define instead of delete trigger on detail table. I.e.

```sql
create trigger tr_test on detail
instead of delete as
begin
  select 1;
  -- now the fun begins
end
```

You get an nice error: `Cannot create INSTEAD OF DELETE or INSTEAD OF UPDATE TRIGGER 'tr_test' on table 'detail'. This is  because the table has a FOREIGN KEY with cascading DELETE or UPDATE.`. What the hell??? :o Why?

Again I got a direct proof, that in this area the MS SQL is wrong, very wrong. I would be willing to accept the limitation when I'll be doing there some `master` table manipulation (yes, as I said, cascade constraints are bad too). But this? I can hardly believe my eyes. The trigger is almost empty. Or am I missing someting on backround that limits this to work?

Another "feature" that makes me love Firebird more.
