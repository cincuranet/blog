---
title: |-
  Operátor ??
date: 2006-05-22T12:59:00Z
tags:
  - .NET
---
V C# je zajímavý operátor. Jedná se o `??`. Každý asi zná (nebo aspoň slyšel o) `?:`, ale co `??`.

Operátor ?? může pomoci při používání nullable typů. Často totiž potřebujete do jiné proměnné přiřadit buď hodnotu nebo vlastní "chybovou". Samozřejmě vše lze ošetřit pomocí `if`u (jako vždy), ale proč si věc neusnadnit.

```csharp
int? x = null;
int y = x ?? -1;
```

Tato kontrukce nám zajistí, že pokud je `x` ne`null`ové, bude do `y` přiřazena jeho hodnota. Jinak bude přiřazeno `-1`. Dobré, že? ;-)