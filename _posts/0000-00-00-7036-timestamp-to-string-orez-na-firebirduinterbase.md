---
title: |-
  TIMESTAMP to STRING + ořez na Firebirdu/InterBase
date: 2005-12-21T21:24:00Z
tags:
  - Firebird
layout: post
---
Nedávno se v diskuzi objevil dotaz, jak překlopit datum a čas na string, a zároveň část uříznout (konec - setiny, vteřiny, atp.). Vzpomněl jsem si na trik Ivana Přenosila s přiřazením a vyjímkou. Stačilo tedy napsat proceduru:

```sql
SET TERM ^ ;
CREATE PROCEDURE TRUNCDATE (DATETIME VARCHAR(24))
RETURNS (RESULT VARCHAR(16))
AS
BEGIN
  result = '';
  result = datetime; --error, but the truncated value is assigned (I. Prenosil's tip)
  WHEN ANY DO EXIT; --catch error
END^
SET TERM ; ^
```

A bylo po problému. takto můžu ořezat co se mi zachce a jak se mi zachce. Stačí vyzkoušet:

```sql
execute procedure TruncDate(current_timestamp);
```