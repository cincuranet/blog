---
title: "Jak (ne)násilně vypnout Windows Media Encoder?"
date: 2006-03-15T13:17:00Z
tags:
  - Windows
  - Windows Media Encoder
layout: post
---
Používám WME k ukládání nějakých pořadů z TV karty, když nemám v tu chvíli čas na shlédnutí. Přes SDK ovládám celou tuhle "věc" v konzoli. Problem je, že mám udělány skripty, které vše zařídí, atp. Jsem (přirozeně) líný pokaždé editovat skripty a tak mám nastavenu délku záznamu na 4 hodiny. To většinou stačí (a to i když se seknu o hodinu při spuštění :)).

Pokud však pořad už skončí a já už jsem v té chvíli chci něco jiného, musím WME nějak (ne)násilně ukončit. Ale. Pokud se na stroj přihlásím a přes TaskManager zabiju daný proces, není soubor korektně zakončen a jsou s tím jen problémy (OK je to přirozeně jen pokud se vysílání neukládá a dívám se "live", ale to je málokdy). Dlouho jsem se pokoušel najít nějaká řešení, jak encoder ukončit. Až jednou... Přišel jsem na vskutku systémové řešení. 

Prostě _přenastavím hodiny na počítači o pár hodin dopředu_ a proces jednoduše korektně skončí. :) Toť vše.