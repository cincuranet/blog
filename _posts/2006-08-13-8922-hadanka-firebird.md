---
title: |
  Hádanka (Firebird)
date: 2006-08-13T12:52:00Z
tags:
  - Firebird
layout: post
---
Mějme takovéto zadání:

```sql
create table new (old integer);
set term ^ ;
create trigger new_bu1 for new
active before update position 0
as
begin
  select new.old from new where old.old = new.old into new.old;
end^
set term ; ^
insert into new (old) values (1);
update new set old = 2;
select * from new;
```

Jaký bude výsledek? :-D

<small>Pozn.: Vymyslel Milan Babuskov na firebird-suport listu.</small>