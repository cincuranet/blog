---
title: "Velká písmena na Firebirdu 1.5"
date: 2006-11-18T07:25:00Z
tags:
  - Firebird
layout: post
---
Na konferenci jsem se dozvěděl, jaktože FB 1.5 občas správně provedl UPPER na národních znacích a někdy na to zarytě kašlal. Je to velice prosté - pokud je na sloupci definováno collate, funguje vše dobře. Když se použije defaultní, funkce UPPER nepřevede národní znaky dobře (no vlastně je nechá tak jak jsou ;-)). FB 2 už má toto samozřejmě opraveno.

No a pojďme omrkat ukázku:

Vytvoříme tabulku:

```sql
create table test (col1 varchar(20) character set win1250 collate PXW_CSY, col2 varchar(20) character set win1250);
```

Vložíme data:

```sql
insert into test values ('ěščřžýáíé_aaa', 'ěščřžýáíé_aaa');
```
A zkouška:

```sql
select upper(col1), upper(col2) from test;
```

```text
UPPER                UPPER
==================== ====================
ĚŠČŘŽÝÁÍÉ_AAA        ěščřžýáíé_AAA
```

A je hotovo. Funguje. Doufám, že tento malý tip pomůže. Nevím, kdo na to přišel první, já to však vím od Stefana Heymanna.