---
title: |-
  is, as, != null
date: 2009-05-20T16:04:00Z
tags:
  - C#
  - Programming in general
---
Po diskuzi v postu [if, else, return][1] jsem si uvědomil, že mám v kapse ještě jeden případ, který je podobně sporný-zajímavý. Tyto dvě konstrukce vídávám a opět v zásadě stejné - nebo ne?

```csharp
Foo x = (y as Foo);
if (x != null)
{
  x...
}
else
{
  // <error>
}
```

resp. <small>(samozřejmě můžeme i přiřadit do `x`)</small>

```csharp
if (y is Foo)
{
  (y as Foo)...
}
else
{
  // <error>
}
```

Osobně používam druhý způsob, opět spíše pocitově něž pro nějaký fakt (myslím, že z toho `is` je výsledek mého snažení lépe čitelný). A co vy? Případně máte nějaký argument proč používat jedno nebo druhé?

[1]: {{ include "post_link" 230213 }}