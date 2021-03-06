---
title: |-
  Pošta, e-mail atp.
date: 2006-12-12T21:40:00Z
tags:
  - Uncategorized
---
Je email mrtvý? Trošku zavádějící věta. Nechci zde rozebírat problémy spamu atp., nýbrž problém přístupu k mailu.

Většina uživatelů používá pravděpodobně POP3 protokol. To je dobré pro lidi co mají počítač doma či v práci a tam si čtou poštu. Uživatelé, kteří více pracují s mailem a chtějí některé sofistikovanější věci asi sáhnou po IMAP4 protokolu. Ovšem ani jeden protokol asi není to pravé co by člověk potřeboval. Další skupinou jsou webmaily. Pokud pominu některé ne příliš vyladěné produkty jako IMP Horde, OpenWebMail nebo SquirrelMail, které pro opravdovou práci nestačí máme tu pár dobrých aplikací na freemailech (dobrých většinou díky AJAXu). Na vlastní/firemní doméně nemůžete provozovat tyto produkty jak se vám zlíbí a tak zbývá (podle některých geniální) GMail for Your Domain a obdobná služba Windows Live Custom Domains. Ještě nám zbývá např. pronájem Exchange serveru nebo třeba SSH a mutt, ale tyto produktu nechám poněkud stranou, neb nejsou tak rozšířeny.

Co nám tedy zbývá. POP3 je zavrženo (aspoň v této úvaze) a tak nám zbývá IMAP a webmail.

Pro IMAP nám hovoří možnost použít libovolného klienta, máte poštu (pokud to klient umí) většinou přístupnou i když nejste připojeni, také je s nativním klientem rychlá práce (o když někteří stále netuší co to je vlákno/thread), nepřenáší se nic co se přenášet nemusí (např. GUI). Nevýhodou je však celé fungování. Vyhledávání nefunguje nějak sofistikovaně, ne každý klient dokáže držet celý mailbox off-line a také ne každý dokáže rovnou maily stahovat celé a ne jen hlavičky. Vlastní kapitolou jsou problémy se SMTP (ačkoli to není IMAP, nějak ty maily na druhou stranu dostat musíte) – blokovaný port 25 v některých sítích, přístup na mailserver povolen jen odněkud atp.

A co webmail? Zahoďme rovnou "klasické" webmaily a klasické freemaily. První skupina prostě na opravdovou práci není a druhá ani z principu (prostě na firemní doméně to nepojede). Co tedy např. jedněmi proklínaný – druhými opěvovaný gůgl mail? Výhody jsou jasné. Maily jsou přístupné kdekoli, kde je browser a konektivita. To na druhou stranu přináší problém, že maily nemáte v off-linu (a většinou to člověk potřebuje když je nemá).Vyhledávání je de facto v pohodě, vše se děje na serveru a člověk dostane vždy výsledek. Podobně SMTP je pasé. Leč ovládání už není tak rychlé. Na pomalejší lince i při sebelepší AJAXové implementaci narazíte na zpoždění.

Otázkou další je dostupnost. Pokud si někde platíte mailhosting a něco nejede, můžete na někoho řvát (i když to asi moc nepomůže, ale máte aspoň pocit, že když sakra platím, tak to musí do jedné minuty opravit, jinak se zblázním) a mít pocit, že si něco kupujete, že něco máte (a snad že i v případě velkého problému můžete dostat nějakou finanční satisfakci). A co Google/Windosw Live apod. pro vaši doménu? Většinou je to zdarma a takto velké společnosti asi nějaký totální krach HW mít nebudou (pozn.: seznam.cz stranou). Ale je to zadarmo, a tak i kdyby se to podělalo, máte smůlu a můžete se jít klouzat.

Co tedy vlastně použít? Co používáte Vy? Jaká výhoda či nevýhoda nakonec určila vítěze? A co třeba úplně něco jiného? Co dalšího může jednu či druhou službu diskvalifikovat?

<small>Pozn.: Záměrně jsem vynechal věci jako třídění a filtrování na serveru, antivirová ochrana nebo antispam. Každé může být hodnoceno více než individuálně a každý požaduje něco jiného na základě jiných vstupů.</small>