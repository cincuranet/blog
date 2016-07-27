---
title: "Referencuji, referencuješ, referencujeme"
date: 2006-04-10T20:01:00Z
tags:
  - .NET
  - Firebird
redirect_from: /id/7894/
layout: post
---
A máme to tu zas. Mám na to prostě asi štěstí. Databáze "naklikávám" podle čmáranic v GUI (je to pohodlnější, neboť to umí ledacos doplnit). Jenže jak to něco doplňuje, něco se přehlédne.

Během ladění kódu (mj. hraju si teď s ASP.NET a je to zajímavé) mi to vyhazovalo `FormatException` na `ExecuteNonQuery`. Byl jsem z toho celkově zmatený a divil jsem se, že nedostávám nějaké přesnější info. Když jsem všechno několikrát prošel, zakomentoval, odkomentoval a stále nic, udělal jsem (pro mě) poslední pokus. Zapsal jsem insert přímo do zadání. A hle, hned jsem uviděl, kde to nesedí.

A právě tady mě GUI vypeklo. Jak jsem tam ládoval tabulky, u jedné jsem u FK nechal přednastavený integer, kdežto nadřazená tabulka byla `varchar(32)`.

Ach jo, taková kravina a človek s tím stráví skoro hodinu času.