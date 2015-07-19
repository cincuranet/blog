---
title: "IEnumerable&lt;string&gt; result for some methods in System.IO"
date: 2010-03-06T17:11:35Z
tags:
  - .NET
  - Programming in general
redirect_from: /id/231298/
category: none
layout: post
---
The .NET Framework 4 includes some nice new methods in [System.IO namespace][1]. There's a lot of methods on [Directory class][2] etc. returning `string[]`. That's OK until you try to enumerate directory with thousands of files (for example). Then you're waiting for complete result even is you just need couple of first item. The new EnumerateXxx methods are solving this as these are returning `IEnumerable<string>` (i.e. [EnumerateFiles][3]).

I'm looking forward to use these in [ID3 renamer][4] when .NET Framework 4 will be released.

[1]: http://msdn.microsoft.com/en-us/library/29kt2zfk(v=VS.100).aspx
[2]: http://msdn.microsoft.com/en-us/library/wa70yfe2(v=VS.100).aspx
[3]: http://msdn.microsoft.com/en-us/library/dd383571(v=VS.100).aspx
[4]: http://www.ID3renamer.com