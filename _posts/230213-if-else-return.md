---
title: |-
  if, else, return
date: 2009-05-14T21:05:00Z
tags:
  - C#
  - Delphi/Object Pascal/Pascal
  - Programming in general
---
Občas vidím ve zdrojácích funkce s konstrukcí:

```text
if (<condition>)
{
  x = DoSomething(y);
  return x;
}
return z;
```

Což je víceméně to samé jako:

```text
if (<condition>)
{
  x = DoSomething(y);
  return x;
}
else
{
  return z;
}
```

Osobně používám druhý zápis. Přijde mi o něco přehlednější a explicitnější. Pravděpodobně vliv Delphi/ObjectPascalu.

Je však v těchto zápisech nějaký rozdíl? Nějaký praktický aspekt, který mi uniká?