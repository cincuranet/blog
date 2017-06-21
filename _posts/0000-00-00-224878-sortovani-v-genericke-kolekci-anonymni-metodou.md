---
title: |-
  Sortování v generické kolekci anonymní metodou
date: 2007-04-18T08:04:00Z
tags:
  - .NET
---
Když jsem dneska četl [Anonymní metoda pro hledání v generické kolekci][1] vzpomněl jsem si, že jsem podobnou věc dělal u sortování.

```csharp
public void SortByPosition(bool descending)
{
  ((List<FbIndexSegment>)this.Items).Sort(delegate(FbIndexSegment item1, FbIndexSegment item2)
  {
    return (descending ? -1 : 1) * item1.Position.CompareTo(item2.Position);
  });
}
```

Někde jsem podobné řešení viděl a jen jsem to vydloubal z hlavy a upravil.

[1]: http://blog.vyvojar.cz/dotnet/archive/2007/04/18/224807.aspx