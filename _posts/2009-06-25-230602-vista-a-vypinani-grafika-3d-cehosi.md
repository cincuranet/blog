---
title: "Vista a vypínání grafika-3D-čehosi"
date: 2009-06-25T17:01:20Z
tags:
  - .NET
  - Windows
  - Windows Presentation Foundation (WPF)
redirect_from: /id/230602/
category: none
layout: post
---
Vista mi jaksi vypíná grafika-3D-cosi (zajímavé, že to začalo zlobit až po instalaci systému s integrovaným SP1). Takže se minimalizace okna, scrollování nebo třeba Alt-Tab trošku zasekávalo. Hlavně Alt-Tab mě štvalo, protože trvalo relativně dlouho, než se zobrazilo. Po dlouhé snaze vyřešit to systémově, jsem přešel na "programátorské” řešení.

Vzal jsem první WPF sample s pěknou 3D animací a udělal z toho aplikaci, bez tlačítka na taskbaru. A překvapivě to skvěle funguje. Aplikace mi běží na pozadí a jsem spokojenej.

Zde je vidět desktop s běžící aplikací:

![image]({{ site.address }}/i/230602/desktop_CubeAnimation.jpg)
