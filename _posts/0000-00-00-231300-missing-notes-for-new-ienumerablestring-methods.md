---
title: |-
  Missing notes for new IEnumerable<string> methods
date: 2010-03-06T17:12:31Z
tags:
  - .NET
  - Documentation
  - Programming in general
---
I noticed is that the documentation for some of [new IEnumerable<string> methods in System.IO I wrote before][1] is missing important parts. For example, the [old method][2] has notes about [unstable sorting][3] and about the different behavior for patterns where the extension is exactly three characters long. But the [new one][4] is missing these notes and these are quite important, in my opinion. I hope this is just because we're in RC stage and in RTM all will be ready. Else it could cause confusion when using new methods (until you find the string[] version (or this post ;))).

[1]: {% include post_link id="231298" %}
[2]: http://msdn.microsoft.com/en-us/library/ms143316(v=VS.100).aspx
[3]: {% include post_link id="231149" %}
[4]: http://msdn.microsoft.com/en-us/library/dd383571(v=VS.100).aspx