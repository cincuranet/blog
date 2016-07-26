---
title: "Oprava FQDN v SMTP pro System.Net.Mail"
date: 2008-11-08T18:32:00Z
tags:
  - .NET
  - Windows
redirect_from: /id/228590/
category: none
layout: post
---
Pokud jste někdy posílali mail pomocí System.Net.Mail a SMTP server očekával v příkazu EHLO/HELO fully qualified domain name, docela jste se zapotili. Jednoduše se smtp klient nedal přemluvit. Sám jsem na problém narazil. :)

Pokud máte stejný problém stačí nainstalovat resp. vyžádat hotfix [http://support.microsoft.com/kb/957497][1] a je vymalováno. 

[1]: http://support.microsoft.com/kb/957497