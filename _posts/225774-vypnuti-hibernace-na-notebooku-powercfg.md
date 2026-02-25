---
title: |-
  Vypnutí hibernace na notebooku (powercfg)
date: 2007-06-12T19:22:00Z
tags:
  - Windows
---
Včera jsem potřeboval na jednom notebooku s WinXP vypnout podporu pro hibernaci. Šel jsem na jistotu do Ovladacích panelu, ale ouha, vyrobce tam nacpal nejakou svoji utilitu, takze klasicky MS dialog nikde. Samozřejmě přes ten jejich "rohy kulaté, menu krásně animovaná"-dialog šlo nastavit pár věcí kolem baterky, ale o hibernaci ani památky. Jak z toho ven? Zkusil jsem smazal soubory hiberfil.sys ručně (páč jsem slyšel, že to hibernaci vypne), bum, neúspěch, soubor se drží zuby nehty (to by mě zajímalo, jak jej nějaké BFU smazalo). No nic, chvíli jsem laboroval s tím "rohy kulaté, menu krásně animovaná"-dialogem, ale nic. Pak mi to (náhodou :)) cvaklo. Příkaz `powercfg`. Stačilo `powercfg /?` a hned to bylo jasno. Proč jsem jej hned na začátku nepoužil, nemusel bych se pak rozčilovat nad tou utilitou výrobce.