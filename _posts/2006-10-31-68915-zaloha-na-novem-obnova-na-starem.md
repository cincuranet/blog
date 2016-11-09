---
title: "Záloha na novém, obnova na starém?"
date: 2006-10-31T20:51:00Z
tags:
  - Firebird
layout: post
---
Asi trochu podivný nadpis. Nicméně vzhledem k tomu, že každou chvíli můžeme očekávat Firebird 2.0. A jak to tak bývá, bude se nejdříve trochu experimentovat (nepředpokládám, že by někdo vyměnil 1.5 hned na 2.0 bez otestování), ale i tak se může stát, že vše krásně pojede a až později se objeví problém, který možná nepůjde vyřešit hned. Potom budete chtít udělat zálohu z FB 2.0 a přěnést ji zpět na 1.5.

Aby se to vše pěkně podařilo (a ušetřili jste si problémy s tím, že to na první pokus nepůjde), musíte vzít gbak z verze 1.5 a s ním udělat zálohu DB z 2.0 serveru a tu pak obnovit na 1.5. Pokud použijete gbak z verze 2.0, dostane se vám na 1.5 hlášky "Expected backup version ...". :-)

Jednoduché a rychlé. Přeji vám, aby se problematické chvilky nekonaly a vše šlapalo na první pokus s Firebirdem 2.0.