---
title: |-
  Zařazení něčeho do kategorií...
date: 2008-01-03T17:54:00Z
tags:
  - Best practice or not?
  - Databases in general
layout: post
---
Dneska jsem se dostal opět k velmi vtipnému řešení problému v relační databázi (to jsem to hezky napsal, ale ve skutečnosti jde o prasácky vyrobenou tabulku(y) vyústivší v prasácké selecty).

No schválně. Jak budete řešit přiřazení položky do kategorií? Ano, například jednoduchá tabulka `(id_item, id_kategorie)`. Ale to je řešení běžné... Vskutku vtipné řešení, je přidat k položce sloupec, který obsahuje znakem, např. `|`, oddělené hodnoty. Pak máte velmi výkonný select `SELECT * FROM tabulka WHERE (kategorie LIKE '%|12345|%') ORDER BY id` (nad `select *`` se již nepozastavuji).

No to si pak užijeme legrace s sql serverem, že? ;)