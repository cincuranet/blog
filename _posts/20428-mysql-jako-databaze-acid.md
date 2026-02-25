---
title: |-
  MySQL jako databáze? - ACID
date: 2006-10-01T10:30:00Z
tags:
  - Databases in general
---
Před několika dny mě ráno napadlo, jestli MySQL (tak masivně) využíváno vůbec podporuje základní koncept ACID. Dlouho jsem o tom nepřemýšlel, přestalo mě to bavit (asi hlavně kvůli tomu, že MySQL prostě nemusím). Nicméně odpoledne jsem měl schůzku s kolegou, který je velký znalec databází a mj. šéfredaktor dbsvet.cz. Během řečí se nějakým záhadným způsobem řeč dostala na téma MySQL & ACID. Po několika konstruktivních úvahách jsme odsouhlasili, že MySQL ACID neumí.

Abych to podložil nějakou ukázkou, zamysleme se nad prvním bodem - Atomicitou. Vzhledem k tomu, že pokud spustíte v MySQL např. dva delete příkazy a druhý zhavaruje, potom první naprosto bez řečí zůstane v DB zachován, i když by měl být zrušen. Neboť blok dvou delete mezi begin a commit/rollback (ani nevím, jestli to v MySQL můžu takto nazvat)) je z našeho pohledu nejmenší jednotka, kterou už nelze dělit a je nutné ji vykonat vcelku. Díky tomuto faktu, se nám zjevně nabořila i další věc - Konzistence. O Isolaci už vlastně ani mluvit nemusíme, i když každý může zkusit, že nic takového se nekoná. Naopak Trvanlivost (D) je vlastně splněna (když pomineme ostatní chybičky). Když blok "commitnete" (to zní fakt divně), tak je tam a je to (dokonce je jaksi v DB dřív než by člověk chtěl :)).

A co ostatní? Jak moc vám (ne)vadí v MySQL absence základních věcí (IMHO dalo by se toho překousnout hodně - na aplikační úrovni to prostě oddřete, ale bez transakcí to už je trochu moc).

EDIT:

Dostal jsem několik zajímavých komentářů nejen tady, ale také mailem. Předně bych chtěl říci, že MySQL rozhodně nezatracuji - má oblibená DB je sice Firebird nicméně i na MySQL "občas" něco postavím. Vím, že MySQL má i jiné engine, které transakce podporují, já jsem však vycházel z (asi) nejpoužívanějšího MyISAM - je na hodně hostinzích a je takový defaultní.

Nikomu nenutím svůj názor - at si klidně na MySQL jede dál (a stejně to bude nejpoužívanější DB, spojení MySQL+PHP+Apache je neskutečně silné). Není to tak špatná DB, ale jsou lepší. ;)

_Uff, musím se jít na chvíli zalogovat na FB. :)_