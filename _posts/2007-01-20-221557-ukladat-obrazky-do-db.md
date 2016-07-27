---
title: "Ukládat obrázky do DB???"
date: 2007-01-20T10:01:00Z
tags:
  - Databases in general
redirect_from: /id/221557/
layout: post
---
Tento post chci napsat již dlouho. Ale pořád jsem buď neměl čas nebo chuť či odvahu. No ale nakonec se hvězdy dostaly do správné konfigurace a píšu.

Slyšel jsem hodně názorů ohledně ukládání obrázků do databáze (nebo obecně souborů, ale většinou se toto řeší s webem apod.). Zajímavé je, že většina lidí argumentuje stále tím samým a vždy říkají, jaké to má ohromné nevýhody. Nicméně nikdy jsem ještě neslyšel názor, který by přihodil i nějaké výhody a provedl zamyšlené porovnání.

Proč tedy všichni tak striktně odmítají uložení obrázků do DB? První argument, který každý vytasí je rychlost resp. pomalost. Nedělal jsem žádné podrobné testy pro určitou platformu, ale je jasné že to musí být o něco pomalejší je přece další vrstva mezi aplikací a souborem. Dalším argumentem je většinou velikost DB, to je celkem nepopiratelné. A nakonec "na bedně" máme ještě - trochu slabší, ale ... - že "taková" data do DB nepatří.

Nejsem odpůrcem ani zastáncem ani jedné strany (i když otevřeně říkám, že neodmítám ukládání obrázků apod. do DB). Pojďme se ale podívat na vítěznou trojku a zkusit se nad tím zamyslet. Tedy třetí argument, ten mi připadá úplně "nejblbější". Proč by proboha obrázky v DB nemohly být? Jsou to přece data jako každá jiná a chci-li s nimi takto pracovat není na tom nic špatného. Další. Velikost databáze. Jasně, když jsou tam data, musí místo zabrat. Kdyby byly na disku, tak taky místo budou zabírat. Je pravda, že s větší DB se hůře pracuje (zálohy, obnova, přesuny, ...), ale neviděl bych to jako velký problém - můžeme ho přece lehce vyřešit např. rozdělením. A osobně nemám s velikostí problém - a pokud by snad nějaká DB mělo mít problémy s tím obsluhovat "velkou" DB nezaslouží si nic než zahodit. No a první - pomalost. Nevím o kolik procent mi toto sníží výkon, takže budu spíš polemizovat. Podívám-li se na to, ale z druhé strany, tak jako tak dříve nebo později nebude rychlost vyhovovat. Buď je třeba posílit HW nebo použít mozek - např. cacheování. Když to tak vezmu, tak s obrázky v DB si akorát trochu zkracuji tu cestu do fáze, kdy mi výkon nebude stačit. Pokud půjde použít mozek, paráda, můžu to lehce vyřešit. Pokud půjde o HW a nedělám projekt, u kterého nečekám růst (kdo by to dělal?), tak s růstem bude určitě třeba povýšit i HW. Ale je pravda, že všechny tyto věci jsou zbytečné nebudou-li obrázky v DB. Dobře tento argument beru - nemůžeme jej popřít ani potvrdit.

Co se ale podívat na výhody uložení v DB? První co mě napadne je určitě výhoda v podobě transakčního zpracování. Nikdo mi nevymluví, že transakce jsou skvělá věc. Pokud máte na aplikaci, která právě taková data zpracovává není nic lepšího než využít všech možností transakcí a constraintu apod. věcí. Nemusím se pak spoléhat na aplikaci, že vše udělá správně. Můžu to nechat na DB a můžu si taky DB updatovat přímo z konzole, což se někdy může velmi hodit. Další věc co mě napadá je zálohování a archivace. Pokud mám jednotné úložiště, vše je jednodušší. Co dál? Co třeba přístup z více míst najednou? Mám-li už jednou přístup do DB mám rovnou i přístup k obrázkům (ne že by nešlo vzdáleně pristupovat na FS, ale když už do DB pro jiná data musím, je to pak o starost méně). No a poslední věcí (co mě napadlo, né celkově) jsou práva. Když už jsem se patlal s přístupem k jiným datům v DB, tak udělat to nad tabulkou "obrazky" nebude mnoho práce navíc.

Chápu, že celý tento text je poněkud kontroverzní, a určitě přide někdo, kdo řekne "ty si ale pako, obrázky do DB nepatří a prostě nemáš pravdu" - já netvrdím, že tam patří (nebo nepatří), jen jsem se chtěl podívat na argumenty, kteří zarytí odpůrci používají.

Nejsem zastánce ani jednoho extrémního řešení, vždy si to chce celou věc pořádně promyslet.