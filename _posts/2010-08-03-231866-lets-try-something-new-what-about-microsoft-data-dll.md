---
title: |
  Let's try something new... What about Microsoft.Data.dll?
date: 2010-08-03T13:39:04Z
tags:
  - .NET
  - Databases in general
layout: post
---
The new [Microsoft.Data.dll][1] seems to be very "interesting". 8-)

I generally agree, that pure raw ADO.NET is more verbose than the shown example. And that's all. On the other hand, everybody using pure raw ADO.NET have written couple of helper methods already. And directly for his/her desired approach, with non-dynamic typing. This isn't going to make anyones life easier. As an experiment with dynamic keyword it's nice. But a stuff used in real world deployed application? No so sure.

Wanna go easy path? Go LINQ to SQL of Entity Framework with just 1:1 model generated from database (if we're on MS's stack, [NHibernate][2] or [LLBLGen Pro][3] will do the work as well). Wanna go pure SQL, all under own control? ADO.NET is waiting for you. But this, this looks like kind of mixture of both, but nothing good resulted.

By the way, will there be any support for parametrized queries? I hope so. Because if not, then it's even more funny than it already is.

UPDATE: There's a support: [http://blog.andrewnurse.net/2010/08/03/MicrosoftDataItrsquosNotAsEvilAsYouThink.aspx][4].

For me it's a step back. Or am I missing something?

[1]: http://weblogs.asp.net/davidfowler/archive/2010/08/02/introduction-to-microsoft-data-dll.aspx
[2]: http://nhforge.org/
[3]: http://www.llblgen.com/
[4]: http://blog.andrewnurse.net/2010/08/03/MicrosoftDataItrsquosNotAsEvilAsYouThink.aspx