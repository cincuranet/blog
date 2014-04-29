---
title: "String.Format \"args\" and Console.WriteLine \"arg\""
date: 2013-11-20T14:27:00Z
tags:
  - .NET
category: none
layout: post
---
I never noticed it, but as I was today rewriting some <a href="http://msdn.microsoft.com/en-us/library/828t9b9h(v=vs.110).aspx">`Console.WriteLine`</a>'s behavior I saw it clear. The <a href="http://msdn.microsoft.com/en-us/library/828t9b9h(v=vs.110).aspx">`Console.WriteLine`</a> (in linked overload) takes `params` named `arg`. But the <a href="http://msdn.microsoft.com/en-us/library/b1csw23d(v=vs.110).aspx">`String.Format`</a> takes `params` named `args`, as you would probably expect.

<!-- excerpt -->

Wondering how that happened. :) Sure, it has almost zero impact on the code itself and changing it would be a breaking change (now with <a href="http://msdn.microsoft.com/en-us/library/vstudio/dd264739.aspx">named parameters</a> it's little bigger break), but we has bigger changes in even behavior during the years. Or maybe it's just to cosmetical. 8-)
