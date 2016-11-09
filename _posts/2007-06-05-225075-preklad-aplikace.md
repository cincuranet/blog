---
title: "Překlad aplikace"
date: 2007-06-05T22:57:00Z
tags:
  - Uncategorized
layout: post
---
Asi všichni čekáte, že zde budu rozebírat možnosti, jak udělat různé jazykové mutace ASP.NET stránek. Omyl. Dokonce nebudu ani rozebírat způsoby jak dělat více jazyků ve WinForms aplikaci (i když mám v plánu jednu aplikaci takto lokalizovat, takže možná nějaké postřehy budou). Chci ukázat něco v PHP a MySQL (to koukáte co?), nicméně postup je použitelný i na jinou kombinaci technologií.

Dostala se mi do rukou aplikace - e-shop - v PHP, který potřeboval být rozšířen o jeden další jazyk. Nešlo jenom o to, aby tlačítko "Odeslat dotaz" mělo jiný nápis, šlo hlavně o to, aby výrobky aspol. fungovalo ve dvou jazycích. Protože aplikace nebyla napsána moc čistě a databáze taky nevypadala, že by se o ní dalo opřít, řešil jsem, jak s co nejmenším hrabáním do kódu (a tedy potenciálním poškozením něčeho) tohle vyřešit. Napadla mě zajímavá myšlenka, kterou jsem nikdy nezkusil, ale zdálo se mi, že by mohla fungovat.

Rozšířil jsem tedy všechny tabulky, u kterých to dávalo smysl o další sloupce, kde byly názvy, popisy, parametry ceny, slevy atp. k výrobkům v dalším jazyku. (Pozn.: Nepřišel jsem na způsob, jak v MySQL změnit pozici sloupce po vytvoření. Ne že by to vadilo, jen je to přehlednější. Takhle jsou nové na konci. Ale asi to nějak jde. :)) Původní sloupce také přejmenoval (dal jsem suffix podle jazyka). Následovala tvorba view, které měly stejný název jako tabulka, jen suffix podle jazyka a vracely záznamy přesně ve formátu původních tabulek, včetně původních názvů sloupců. Potom jsem vzal PHP skripty a všechny odkazy na tabulky ve from, join apod. jsem přepsal tak, aby četly z daného view (jazyk byl uložen v proměnné a přidán do příkazu). Ještě jsem pro ně přidal alias na původní jméno, protože se na pár místech odkazovalo na sloupec plným jménem.

Celé to fungovalo bez složitých změn v kódu, bez přepisování názvů sloupců na hromadě míst (o kterých nikdo neví kde jsou :)) a výkon to nijak neubírá. Lehce se pak upravili i inserty a updaty (i když by šlo použít i view a updatnout 2x) a bylo téměř vymalováno.

Rozhodně jsem nevymyslel kolo, ale nikdy jsem takovýto postup nezkusil a nevěděl jsem, jestli někde nenarazím na něco co jsem nedomyslel. Zatím vše funguje. Uvidíme co se po... :)

Ukázka:

1. tabulka "sroubky" (id, nazev, popis, co_ja_vim)
2. úprava "sroubky" (id, nazev_cz, popis_cz, co_ja_vim_cz, nazev_rr, popis_rr, co_ja_vim_rr)
3. vytvoření view "sroubky_cz" as select id, nazev_cz as nazev, popis_cz as popis, co_ja_vim_cz as co_ja_vim from sroubky
4. to samé pro sroubky_rr
5. pak jen upravit pár míst app (rozhodně méně, než hledat, kde všude je jaké echo atp. ;))
6. +/- hotovo (upravit event. inserty, updaty)