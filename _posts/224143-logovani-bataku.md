---
title: |-
  Logování baťáků
date: 2007-01-23T22:42:00Z
tags:
  - Batch files
  - Windows
---
Uchovávám si logy z různých skriptů, které automaticky spouštím pro pozdější prozkoumání. Ale řešil jsem, jak jednoduše zajistit zápis do logu (občas někde něco člověk zapomene) a případně jeho potlačení. Nakonec jsem vymyslel jednoduché řešení:

```batch
@echo off

if "%1" NEQ "CALL" (
	call %0 CALL > batak.log
	goto finito
) else (
	rem prikazy ...
	goto finito
)

:FINITO
```