---
title: |-
  EdmGen2 for .NET 4.5 and Entity Framework 5
date: 2013-06-03T13:44:17Z
tags:
  - .NET
  - C#
  - Entity Framework
layout: post
---
I don't know whether somebody remembers or even uses EdmGen2. I hope it does. Anyway I was doing my [Entity Framework course][1] last week and demoing [pre-generating views][2] to speed up the startup. Here the EdmGen2 tool comes handy because it's able to work with `EDMX` file directly. You don't have to split it into `SSDL`, `CSDL` and `MSL` to use the standard EdmGen tool. Because I was working in Visual Studio 2012 by default I was working with [Entity Framework 5][3] and [.NET 4.5][4]. Model from this version(s) doesn't work with old EdmGen2. I checked the [original site][5] and sure, the last version (in time of writing) is from 2010.

<!-- excerpt -->

So I grabbed the sources and did changes to work with Entity Framework 5 and on .NET 4.5. Also improved few pieces in code to handle another version(s) properly. Because the original site seems to be dead and the sources are directly downloadable (you're not downloading binary), I imported there into [repository][6] under my [BitBucket][7] account. You can find all the changes in [EdmGen2 repository][8]. If you download the code, open in Visual Studio 2012 and compile, you'll get working binary ready to be used on .NET 4.5 with Entity Framework from v1 through v4 to v5. :)

If you're using this tool, please, drop a line in comments. Maybe it could be merged with [Entity Framework sources][9] and be maintained directly by team. Or at least I'll know it's worth to update it to support Entity Framework 6 (by the way view generation speed was improved in Entity Framework 6).

> [Follow up post.][10]

[1]: http://www.x2develop.com
[2]: {% include post_link id="228787" %}
[3]: http://msdn.com/ef
[4]: http://microsoft.com/net
[5]: http://archive.msdn.microsoft.com/EdmGen2
[6]: https://bitbucket.org/cincura_net/edmgen2
[7]: https://bitbucket.org/
[8]: https://bitbucket.org/cincura_net/edmgen2
[9]: http://entityframework.codeplex.com
[10]: {% include post_link id="233421" %}