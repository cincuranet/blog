---
title: |-
  SqlDateTime overflow při přidávání příspěvku
date: 2005-12-02T17:20:00Z
tags:
  - .NET
layout: post
---
Včera jsem si chtěl napsat jednoduchou aplikaci, abych mohl posílat příspěvky jednodušeji. :) Když jsem to celé pomocí SOAP spáchal, spustil jsem to a hle, nadavá mi to: `Server was unable to process request. --> SqlDateTime overflow. Must be between 1/1/1753 12:00:00 AM and 12/31/9999 11:59:59 PM.`. Pečlivě jsem si přečetl hlášku, upravil datum a čas, ověřil pomocí message-boxu a nic. Večer jsem to řešil na fóru, několik zajímavých nápadů bylo, ale nic nezabralo. Dnes odpoledne jsem zkusil jinou službu (získání kategorií) a ta jde v pořádku. Takže v kódu to nebude, ale asi to bude fakt něco s datem/časem. Jenže ať dělám co dělám tak pořád nic. Žádné další aplikace nechci, tahaji s sebou toho moc zbytečnýho. Aspoň jsem si udělal přes Operu udělátko, abych měl stránku pro posty po ruce.

Uvidíme, třeba se to povede. Kdyžtak vám dám vědět.