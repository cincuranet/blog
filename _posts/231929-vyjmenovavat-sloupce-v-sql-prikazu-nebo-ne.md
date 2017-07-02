---
title: |-
  Vyjmenovávat sloupce v SQL příkazu nebo ne???
date: 2010-08-24T20:35:12Z
tags:
  - Databases in general
---
Nedávno se na [Builderu lehce rozjela diskuze][1], ačkoli v threadu na odlišné téma, jestli sloupce v SQL příkazech vyjmenovávat nebo ne. Nedá mi to a přispěju taky svou troškou.

Já bych "problém" rozdělil na dvě části. První je SQL kód v aplikaci. Druhou je kód v rámci pohledů, spouští, uložených procedur atp.

V prvním případě jasně a striktně sloupce vyjmenovávám. Jednak mám pocit, že to přidá na přehlednosti. Nejenom v rámci zápisu, ale i když později človek kód prochází a třeba něco přidává - vidí co do aplikace přichází a jak se to jmenuje. Případně se tak triviálně (aka Find) dají hledat závislosti. A jednak si myslím, že to ukazuje, že člověk nad výsledkem [přemýšlel][2]. Samozřejmě platí i to klasické, že při změně struktury nedochází k neočekávanému chování, kdy aplikace tahá sloupce, o kterých nemá ponětí a nedokáže je využít.

V druhém případě to již tak striktně nemám, ačkoli stále jsem daleko od volnosti. Sloupce opět vyjmenovávám, ale mám pár - v pro mě velmi opodstatněných, triviálních případech - "povolení", kdy nevyjmenovávám. V zásadě se jedná o případy, kdy daný objekt jen k datům něco přidává resp. je překlápí. Typicky pohled, který k sadě přidává třeba [RANK][3]. Nebo trigger kopírující data 1:1 navíc do jiné tabulky. Potom si dovolím použít `*` (a někdy i přesto sloupce vyjmenuji). Jinak standardně vyjmenovávám.

Kdejaký nástroj vám všechny aktuální sloupce dokáže vygenerovat: [Flamerobin][4], [SQL Server Management Studio][5], [IBExpert][6], [Database Workbench][7], ... Slušně si je naformátovat do zápisu je pak triviální.

Proč psát něco, čehož chování se může změnit, aniž bych se o tom implicitně dozvěděl. A samozřejmě stále platí to co jsem napsal výše o [přemýšlení nad tím co píšu][8].

[1]: http://forum.builder.cz/read.php?21,3295401,3295818
[2]: http://twitter.com/cincura_net/status/21923365414
[3]: http://en.wikipedia.org/wiki/Select_(SQL)#RANK.28.29_window_function
[4]: http://www.flamerobin.org/
[5]: http://www.microsoft.com/sqlserver/
[6]: http://www.ibexpert.com/
[7]: http://www.upscene.com/products.dbw.index.php
[8]: http://twitter.com/cincura_net/status/21923365414