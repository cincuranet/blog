---
title: |-
  Validace dat - kam jak kde proč
date: 2008-05-18T20:20:00Z
tags:
  - Databases in general
---
Mám rád všelijaká omezení. Jako správně postižený databázista mám constrainty všude. Čistá a konzistentní data mám prostě rád (ano, při upgradech vyměknu a něco někde povolím/odstraním :)) Na druhou stranu nesnáším validace a omezení. 8-| Člověk musí zobrazovat pěkné chybové hlášky, nejlépe ještě před odesláním dat na server. To znamená mít validace a omezení nejen pěkně v databázi, ale i někde poblíž ksichtu aplikace. A to mě nebaví, musíte psát ty samé validace a případně obalovat chyby/vyjímky z DB do konkrétních vyjímek, které je možné patřičně zpracovat. Poté co člověk navrhne hromadu foreign key a check constraintů a čert ví čeho ještě, musí to podat i nějak userovi, tedy user-friendly - překvapivě většině nestačí chybová hláška z DB nebo nějaká obecná věta ;). Ach jo. Škoda že není nějaký generátor, který by uměl tohle všechno vyřešit podle databáze sám.