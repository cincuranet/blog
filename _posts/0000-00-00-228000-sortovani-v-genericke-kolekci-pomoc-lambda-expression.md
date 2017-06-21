---
title: |-
  Sortování v generické kolekci pomocí lambda expression
date: 2008-07-26T11:22:00Z
tags:
  - .NET
---
Před několika měsíci jsem popisoval [Sortování v generické kolekci anonymní metodou][1]. Doba pokročila (C#3.0 a .NET 3.5) a tak není třeba vytvářet delegáta, můžete využít lambda expression (výsledek je ale stejný) a ušetřit si trochu psaní - možná i trochu zlepšit čitelnost kódu.


```csharp
public void SortByPosition(bool descending)
{
    ((List<int>)this.Items).Sort((item1, item2) => (descending ? -1 : 1) * item1.CompareTo(item2));
}
```

[1]: {% include post_link id="224878" %}