---
title: |-
  Předávání předem neznámého počtu parametrů do metody
date: 2008-07-26T21:51:00Z
tags:
  - .NET
---
Někdy se vám může stát, že chcete do metody předat předem neznámý počet parametrů. Vyřešit to můžete lehce předáním kolekce apod. Nicméně je zde ještě jedna možnost. Jedná se o klíčové slovo [params][1]. Tímto klíčovým slovem umožníte předat do metody parametry prostým zadáním a uvnitř je zpracovat jako kolekci. Výsledek pak vypadá takto:

```csharp
static void Main(string[] args)
{
    Foo(10, 20, 30);
}
static void Foo(params int[] numbers)
{
    foreach (int i in numbers)
    {
        Console.WriteLine(i);
    }
}
```

Jednoduché a rychlé.

[1]: http://msdn.microsoft.com/en-us/library/w5zay9db(VS.80).aspx