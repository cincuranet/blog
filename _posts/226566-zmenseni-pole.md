---
title: |-
  "Zmenšení" pole
date: 2007-10-28T09:21:00Z
tags:
  - .NET
---
Před pár týdny jsem do jednoho projektu potřeboval "zmenšit" pole. Šlo o to, že čísla v poli se posílala poměrně omezeným kanálem (mail+url) a vzhledem k tomu, že to byla IDčka záznamů z DB, která byla plus mínus "za sebou" a rostla s časem chtělo to mít alespoň trochu konstatní velikost výsledku (až budou IDčka v řádu tisíců zbytečně plýtváme). Udělal jsem proto triviální "pack" a "unpack".

```csharp
// the array SHOULD be sorted
static int[] Pack(int[] input)
{
	//we need at least 2 items in array
	if (!(input.Length > 1))
		throw new ArgumentException();
	int[] result = new int[input.Length];
	result[0] = input[0];
	for (int i = 1; i < input.Length; i++)
	{
		result[i] = input[i] - input[i - 1];
	}
	return result;
}
static int[] Unpack(int[] input)
	{
	//we need at least 2 items in array
	if (!(input.Length > 1))
		throw new ArgumentException();
	int[] result = new int[input.Length];
	result[0] = input[0];
	for (int i = 1; i < input.Length; i++)
	{
		result[i] = result[i - 1] + input[i];
	}
	return result;
}
```

Pokud jsou ID přibližně za sebou (což jsem já měl) a nejsou tam velké skoky, můžeme tímto poměrně dost znaků ušetřit.

Pozn.: Nakonec se tento postup stejně nepoužil, takže to byla práce do šuplíku na blog. V případě použití doporučuji pořádně otestovat. :)

Ukázka:

```text
Input:
1000
1001
1002
1003
1010
```

```text
Pack:
1000
1
1
1
7
```

```text
Unpack:
1000
1001
1002
1003
1010
```