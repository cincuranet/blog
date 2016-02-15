---
title: "...DataAdapter.Fill(dataSet...)"
date: 2005-09-03T16:58:00Z
tags:
  - .NET
redirect_from: /id/6536/
category: none
layout: post
---
Tak jsem si dneska opět krásně naběhl. Připravil jsem si vše pro připojení k Firebirdu a začal jsem psát takové ty kravinky pro buttony (na testování). Přidal jsem si tam:

```csharp
fbConnection1.Open();
fbDataAdapter1.Fill(dataSet1);
```

a začal testovat. Kompilace - OK, bežíme. Kliknu na tlačítko a ono nic. He, kde je chyba. Hmm, asi něco s dataSetem. Celé vše projdu, nic podezřelého. No nic, zkusím to znovu. Zase nic. Několikrát jsem to celé prošel a stále nic. Hmmm. Umm. Zoufalství. No nic, udělal jsem si tam vlastní DataTable a zkouším. dataGridView pořád nereaguje. Ještě větší zoufalství, kopíruji starší (fungující) kód. Upravím pár stringů a hle. Kompilace, jedem, nic. Ummm. Tak to už snad může bát jen Firebird .NET Data Provider. Stáhl jsem 2.0 Alpha. Zdá se mi divné, že takováto základní věc by nefungovala. Jdu do kuchyně a hle. Po cestě me to napadlo. Mám prázdnou databázi. Jasný, proto v gridu nic nebylo. Provizorně z konzole zapíšu dummy data do DB a jedem. Wow, je to tam. ;)

Co z toho plyne? Až zase nebude něco fungovat, radši nejdříve kontrolovat, jestli tam ma vůbec něco být, než to dvě hodiny ladit. :)
