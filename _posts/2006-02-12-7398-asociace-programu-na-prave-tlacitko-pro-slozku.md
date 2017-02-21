---
title: |
  Asociace programu na pravé tlačítko pro složku
date: 2006-02-12T14:56:00Z
tags:
  - .NET
layout: post
---
Potřeboval jsem, abych si mohl svůj progámek spustit lehce přes kontextové menu vyvolané na složce. Ve starých zdrojácích v [Delphi][1] jsem našel funkci, která sloužila před lety. Pak jsem ji jen přepsal do C#. Kdo má zájem, může využít procedurku níže. Je úplně jednoduchá, kdo chce víc, nechť se podívá do registrů, jak to dělají jiné programy. ;-)

```csharp
public static void AssociateForFolder(string menuName, string exeName)
{
	RegistryKey rk = Registry.ClassesRoot.OpenSubKey(@"Directoryshell", true);
	rk.CreateSubKey(menuName).CreateSubKey("command").SetValue("", """ + exeName + "" "%1"");
}
```

Pozn.: V ostrém nasazení _doporučuji_ ošetřit vyjímky. :-)

[1]: https://en.wikipedia.org/wiki/Delphi_(programming_language)