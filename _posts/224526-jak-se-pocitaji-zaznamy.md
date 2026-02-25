---
title: |-
  Jak se počítají záznamy...
date: 2007-03-08T20:33:00Z
tags:
  - Best practice or not?
  - Databases in general
---
Dnešním příspěvkem bych chtěl ukázt, proč nemám MySQL resp. uživatele MySQL rád. Není to špatná DB, ale špatné jméno jí dělají uživatelé, kteří často postrádají základní znalosti a bohužel je jich obrovská masa, takže "je to vidět".

Dnes kolega řešil zhoršený výkon jednoho z sql serverů, kde beží výhradně MySQL. Po chvilce pátrání se ukázalo, že prezentace běžící na webovém serveru, potřebuje vypisovat počet inzerátů k zobrazení. "Programátor" tvořící aplikaci to vyřešil vskutku kulišácky. Příkazem `SELECT * FROM inzeraty WHERE zobrazovat='1'` vydloubal z DB všechny záznamy, přenesl je z sql serveru na webový a prostě ve smyčce spočítal inkrementací proměnné. Velmi elegantní.

Kolik chyb je v uvedeném postupu můžete spočítat za domácí úkol. No doufám, že další takovéto případy nebudu muset prezentovat často. :)