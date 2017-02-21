---
title: |
  Problém se spuštěním Firebirdu 2.1 Beta 1
date: 2007-07-10T18:16:00Z
tags:
  - Firebird
layout: post
---
Pokud máte problém se spuštěním čerstvé bety Firebirdu (2.1), vězte, že vám chybí manifest pro dll knihovnu (`Microsoft.VC80.CRT.manifest`) (na Windows samozřejmě). Pravděpodobně na to narazíte - jako já - při testování na čistém (virtuálním) stroji (normálně se dostane vše do systému s Office, Visual Studio apod.). Build nebude aktualizován, ale na stránkách Firebirdu ([www.firebirdsql.org][1]) je soubor separátně ke stažení. Stačí jej plácnout do adresáře `bin`.

[1]: http://www.firebirdsql.org/index.php?op=files&id=fb210_beta01