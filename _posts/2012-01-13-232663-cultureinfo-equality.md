---
title: |-
  CultureInfo equality
date: 2012-01-13T20:13:45Z
tags:
  - .NET
  - Best practice or not?
  - C#
layout: post
---
I have a small morale from today. I was writing some code that was handling searching for items base also on [CultureInfo][1]. Because it's a pretty straightforward object, in core of .NET Framework (it's in `mscorlib`) I was expecting to handle equality using `==` based on culture itself not the object. And of course, I was wrong. :)

The code below should explain it clearly (`CurrentUICulture` might be different based on your system).

```csharp
// false
System.Threading.Thread.CurrentThread.CurrentUICulture == System.Globalization.CultureInfo.GetCultureInfo("en-US");
// true
System.Threading.Thread.CurrentThread.CurrentUICulture.Equals(System.Globalization.CultureInfo.GetCultureInfo("en-US"));
```

Yep. Learning something every day.

[1]: http://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo.aspx