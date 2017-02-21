---
title: |
  Jak jsem jednou referencoval na Firebirdu
date: 2005-09-28T20:27:00Z
tags:
  - Uncategorized
layout: post
---
Byl krásný zářijový den a já se večer rozhodl přepsat svůj model DB do SQL skriptu a vyzkoušet. Nebylo to nic těžkého, měl jsem to pěkně namalované, takže jsem byl za hodinku hotov. Po přezkoumání všech vztahů a "znovuzamyšleníse" nad jejich smysluplností jsem nechal skript přechroustat Firebird. Raz, dva a bylo hotovo. Hnedle jsem tam "insertnul" testovací řádky a jedem. Vše vypadalo OK, no ještě zkusím přidávání loginu přímo z kódu. Hups a je tam, bez problému. Skvělé, říkám si, tak ty blbiny smažu a zase někdy (až bude čas) se na to podívám (neb je to moje soukromá hračka :-)). Chci smazat login který jsem vytořil a hle, nejde. Firebird pořád mele o problému s konverzí stringu na jiný datový typ. Hledám, hledám a nic (a říkám si, že ten FB je ale blbec). Nejprve zkouším zrušit vazby u "jasných" tabulek. Pořád nejde. Hmm, že by kód vložil něco špatně a "rozbil" DB, zdá se mi to nemožné. No nic, spouštím GFIX, a nic, vše je OK. Začínám lehce šílet. Pracuji dál, systematicky hledám chybu. Po několika nesystematických :-) dropech všeho co šlo mě to napadá. Metoda min-max. Začínám pomalu odstraňovat objekty v DB. A hle jednu tabulku jsem smázl a už to jde. Hmm, koukneme, kde je problém. Ano! Jedna z tabulek při tvorbě měla zadefinován typ integer, ovšem nadřazená tabulka byla varchar(12). Opravit. Tak a je to. Ještě rychle v mozku prolétnu SQL skript, jestli tam není takováto chyba ještě někde (vznikla při vytváření struktury a přidávání implementačních věcí, jako např. umělé id pro PK, atp.). Ne nic tam není (snad). OK, pro jistotu ješte udělám pro login vlastní doménu, aby se to náhodou při nějakém rozšiřování nestalo. Done.

Bye.