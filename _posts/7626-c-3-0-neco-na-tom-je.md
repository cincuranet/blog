---
title: |-
  C# 3.0 - něco na tom je
date: 2006-03-12T21:15:00Z
tags:
  - .NET
---
Zase jsem se po dlouhé době dokázal prokousat všemi možnými dokumenty, které jsem měl načtené v Opeře a jedním z dlouho-tam-ležících byl i článek [C# 3.0 and LINQ][1]. Obecně nejsem člověk, co má všechny novinky hned v malíčku a používá poslední jazykové konstrukty, co mě tam ale zaujalo, byla možnost rozšíření tříd o vlastní metody. No řekněte, není tohle nádhera:

```csharp
public static class StringExtensions
{
  public static int ToInt32(this string s)
  {
    return int.Parse(s);
  }
}
```

Opravdu myslím, že tohle budu používat. :)

[1]: http://www.microsoft.com/belux/nl/msdn/community/columns/himschoot/linq.mspx