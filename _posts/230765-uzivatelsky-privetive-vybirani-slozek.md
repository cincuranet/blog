---
title: |-
  Uživatelsky přívětivé vybírání složek
date: 2009-07-13T17:31:00Z
tags:
  - Applications in general
  - Programming in general
---
Nevím, jestli je to jen můj problém/pocit, ale v standardním balíku komponent v .NETu není nic co se by se podobalo něčemu jako "shell tree", prostě to co má Explorer v okně nalevo. Hledal jsem i před časem na různých místech, ale nic pořádného.

Právě něco jako shell tree používám v [ID3 renameru][1] a trochu se tam mixuje přístup, kdy fakticky je třeba pracovat přímo s tím co je na filesystému bez ohledu na všelijaké libraries a packages a speciální složky, na stranu druhou běžný uživatel pracuje s pojmy jako „Plocha" a „Tento počítač" (pokud se to jmenuje jinak, omlouvám se, nepoužívám český OS). A tohle všechno výběr komponenty jenom zesložiťuje. Nehledě na to, že XP-Vista-W7, každý systém trochu jiné figurky. To pak aby se tvůrce komponenty zbláznil, když to má transparentně pokrýt.

Přemýšlím proto o jiném přístupu k výběru složky ([ID3 renamer][2] se zaměřuje na dávkové zpracování, takže jednotlivé soubory nejsou ve většině případů pro výběr důležité). Stejně rozklikávat postupně strom nemusí být vždy nejrychlejší. Bohužel mě nic nenapadá – koukám na různé programy a nic. Je jasné, že vybraná cesta musí být viditelná, a to dobře a musí jít rychle a lehce změnit, hlavně takové ty změny „okolo" (jedna složka před a za, …).

_Neřešil někdo podobný problém? Možná chytrá cesta využití standardních dialogů ... Možná něco vlastního, ale ultra jednoduchého, rychlého a účelného ..._

<small>Pozn.: Drag'n'Drop samozřejmě [ID3 renamer][3] podporuje, ale domnívám se, že to není všelék – musí být i možnost změny složky, se kterou chci pracovat i přímo z programu.</small>

[1]: http://www.id3renamer.com
[2]: http://www.id3renamer.com
[3]: http://www.id3renamer.com