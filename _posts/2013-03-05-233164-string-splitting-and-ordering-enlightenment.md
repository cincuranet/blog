---
title: |-
  String splitting and ordering enlightenment
date: 2013-03-05T11:32:06Z
tags:
  - .NET
  - C#
  - Lessons learned
layout: post
---
Couple of years back I wrote a C# that was splitting response from server to lines. I had the data as one string and I needed to have it as array of strings, based on lines. Pretty simple, right?

<!-- excerpt -->

The code I wrote was basically this.

```csharp
response.Split(new[] { "\r", "\n", "\r\n" }, StringSplitOptions.None);
```

And it was working fine. Until yesterday. The server part of the solution was moved to new machine and new language. And now it started returning the exact same string, except for new lines. Now the line endings were `\r\n`, standard on Windows. Without too much thinking you immediately realize, the code above still works, but splits "too much".

Of course, the fix was easy, just changing the order, having `\r\n` first.

Silly me. Still learning.