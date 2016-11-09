---
title: "Firebird .NET 2.0 Provider - první útržkovité postřehy"
date: 2005-12-11T20:42:00Z
tags:
  - .NET
  - Firebird
layout: post
---
Tak jsem tu s prvními pocity s Firebird .NET 2.0 Providerem. Instalace proběhla bez problémů, stačilo pěkně odklikat. Poté jsem si přidal FbCommand, FbConnection, ... do Toolboxu ve VS C# 2005 EE a začal testovat. Vypadá to pěkně, zdá se že všechno jede jak má. Překompiloval jsem i testovací aplikaci a bez problémů (ale pár ostrých aplikací stále radši provozuji na 1.7). Ale jeden problém se přece jen vyskytl. Dnes.

Když jsem si přestal hrát s "konzolovkama" a chtěl jsem přidat FbDataAdapter na formulář, hned to na mě začalo nehezky křičet. Chvíli jsem se s tím pral, ale nic. Na Googlu jsem hledal, ale taky nic neví. Diskuzi jsem prohledal, ale taky nic. Poslal jsem tedy dotaz, uvidíme na co přijdeme. Ručně vytvořit jde, takže v nouzi můžete použít toto.

Zatím ve svých app. stejně potřebuji akorát připojení a command, data většinou jen upravuji nebo jinak překlápím, ale chtěl jsem zkusit i nějaké to zobrazení atd. Doufejme, že brzo najdu řešení.

Nový provider by měl také spolupracovat s VS přes DDEX, zatím jsem to pořádně neotestoval, až budu vědět více, ozvu se.