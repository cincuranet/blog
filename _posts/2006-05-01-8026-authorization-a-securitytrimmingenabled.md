---
title: "&lt;authorization&gt; a securityTrimmingEnabled"
date: 2006-05-01T14:47:00Z
tags:
  - .NET
redirect_from: /id/8026/
category: none
layout: post
---
Potřeboval jsem dnes vytvořit položky menu a skrýt ty které nejsou pro daného uživatele viditelné. V jednom videu na msdn jsem toto viděl, takže jsem "našel" řešení (resp. našel to video a v něm řešení) v podobě atributu `securityTrimmingEnabled`, který stačí přidat do web.config do siteMap sekce k danému providerovi.

Jenže jak to tak bývá nefungovalo to (překvapivě). Začal jsem tedy zuřivě hledat články a popisy všeho možného, co jen trochu souviselo. Po asi hodine neustálého zkoušení různých variací mi to docvaklo.

Já jsem pro řízení přístupu do složek používal `location` sekci ve web.configu v kořenu webu. Stačilo tyto věci přeházet přímo do složek do vlastních web.config a problém byl vyřešen.

Jak jednoduché (jako vždy). :)
