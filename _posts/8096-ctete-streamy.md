---
title: |-
  Čtete streamy?
date: 2006-05-09T20:59:00Z
tags:
  - .NET
---
A čtete je od začátku? Pravděpodobně ano.

To jsem si zase jednou naběhl. Vydloubal jsem ze sítě data, která mi jiná moje aplikace poslala a chtěl jsem je deserializovat a pracovat s nimi dál. Neustále jsem ale dostával výjimku s tím, že byl dosažen konec streamu před koncem parsování. A jak mi to teď k večeru nemyslí, začal jsem prapodivně hledat chybu. Nejprve jsem oveřil, že data jsou všechna - byla. Pak jsem začal laborovat s nějakými identifikátory na konci, abych si byl opravdu jistý (samozřejmě jsem na nic nepřisel). No a nakonec mě musel nakopnout google (viva google).

Jak jsem totiž zapsal data do streamu pro deserializaci, zapomněl jsem přesunout pozici na začátek. :) Ach jo. Deset minut jsem se hrabal v kódu (a samozřejmě jsem ho trochu rozvrtal, takže jsem to musel dávat zpět) a ona to byla takováhle prkotina. :)

`End of Stream encountered before parsing was completed.`