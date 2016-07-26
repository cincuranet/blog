---
title: "Testovací databáze"
date: 2006-09-20T21:09:00Z
tags:
  - Firebird
redirect_from: /id/9552/
category: none
layout: post
---
Také máte jednu testovací databázi, kde zkoušíte všechno možné? Mám jednu takovou pro Firebird. Dneska jsem však narazil na velmi pozoruhodný limit. Jak pořád přidávám (v rámci testování) nějaké tabulky, indexy a procedury pojmenovám je názvy jako 'jirka', 'jiri', 'test', 'testik', 'aaa', 'pokus' a podobné modifikace a ještě s čísly. Dnes jsem ale narazil na problém, že jsem už nemohl vytvořit tabulku, protože všechny "dummy" názvy jsem už vyčerpal. No trvalo mi pak dobrých 5 minut vymyslet nějaké opravdu blbé slovo, které bych mohl použít. Během tohoto usilovného přemýšlení jsem se taky snažil některé tabulky smazat, ale narazil jsem na další zajímavý poznatek. V té hromadě objektů v db mám obrovskou patlaninu vazeb. Jak totiž vytvořím nějakou tabulku a potřebuju něco ještě přireferencovat, hodím referenci na tabulku 'aaa' a pak tabulka 'pokus3' referencuje 'aaa'. Takto se to děje pořád a nakonec člověk nemůže nic pořádně smazat, neboť na tom zase něco závisí.

Vypadá to, že nakonec tu db dropnu a začnu pěkně odznova - ale je bude mi asi po stávajícím bordelu smutno. :)