---
title: |-
  {Read|Write}File Win32 API a peklo v Delphi
date: 2006-01-08T20:54:00Z
tags:
  - Delphi/Object Pascal/Pascal
layout: post
---
Včera jsem psal prográmek, který využíval funkce `ReadFile` a `WriteFile`. Předem říkám, že jsem v Delphi moc s čistým Win32 API nedělal, Delphi má skoro vše pěkně přístupné. Ale pro tento účel jsem musel použít čisté Win32 API. Vše šlo celkem dobře, ale zásek nastal u bufferu. Nadefinoval jsem si klasicky jako `Buffer: array of Byte;`. A kouknul do hintu u funkce, jak se to tam predává. Vidím `var Buffer: Untyped`, říkam paráda, hned si to tam šoupne odkazem a nemusím řešit ukazatel (jak ja to nesnáším). Spustím, dělá co má. Jásám. :) Ovšem než do chvíle, kdy jsem oba soubory (originál a kopii) projel diffem. Soubory se liší. Celé to začínám prohlížet nevidím na dvou příkazech, kde se data načtou do bufferu a zapíšou ven nic podezřelého. Během nesmyslného zkoušení, jsem zjistil, že program od jistých velikostí bufferu spadne, a to buď hned nebo v poslední obrátce smyčky. Po celkem - pro popis nezáživném debuggování - jsem přišel na chybu; resp. hledal jsem na internetu různé věci, které by mě mohly inspirovat a našel jsem. Jako parametr funkce jsem na základě nalezené inspirace (nebo spíš několika inspirací) zadal `Buffer[0]`. A hle ono to fungovalo. Přiznám se, že jsem neřešil co, proč a jak. Důležité je že, to jede.

Ale budu si sakra dlouho pamatovat tenhle "fígl" v Delphi.