---
title: |-
  Firebird 2.5 (final) released
date: 2010-10-04T08:00:43Z
tags:
  - .NET
  - Databases in general
  - Firebird
layout: post
---
Today the [Firebird 2.5 is being released][1]. You can read the [press release][2] and most importantly [release notes][3]. And sure, you can [download it and use/test/deploy][4].

I'm not going to repeat what's written in documents above. Instead I'm going to provide some of my information about using it and some thoughts from [.NET provider][5] view.

To be honest I'm using Firebird 2.5 in production environment since betas (I made a small mistake and wasn't able to easily go back and was lazy to do the long process :)). And I'm more than pleased with the stability. Even the betas were more stable than 2.1, where I, probably thanks to environment, experienced I/O problems from time to time. The language features are nice too. I don't have any personal favorite, all are great addition to whole ecosystem. Actually I do have. It's not a language feature, but a fixed behavior. And it's affecting .NET provider.

In some cases the [left outer join produced wrong results][6]. Unluckily this error was exposed when discovering database structure for [Entity Framework][7], so even you could use 2.1 in production, for development (at least for model generation) you had to use prerelease versions of 2.5 and that's, if nothing else, little bit inconvenient. Not taking into account some internal protocol and core improvements that are now exposed in provider as well. I.e. [cancellation of running command][8] to pin point one.

I could write more and more about the .NET provider and new version. True to be told, I like every improvement I do in provider that may help other to fully unleash the power of Firebird.

Congratulation to us, the [Firebird Project][9], especially the [core team][10]. And also to you, users, I hope you'll enjoy and like the [new Firebird 2.5 version][11] as we (I) do.

Note: _The MindTheBird campaign team will run a webinar today at 13:00 GMT in anticipation of the launch of Firebird 2.5 Final Release. [See the details][12]._

[1]: http://www.firebirdsql.org/index.php?op=devel&sub=engine&id=fb25_release
[2]: http://www.firebirdsql.org/pop/pop_pressRelease25.html
[3]: http://www.firebirdsql.org/devel/doc/rlsnotes/html/rlsnotes25.html
[4]: http://www.firebirdsql.org/index.php?op=files&id=engine_250
[5]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[6]: http://tracker.firebirdsql.org/browse/CORE-1246
[7]: http://msdn.microsoft.com/en-us/library/bb399572.aspx
[8]: {% include post_link id="231316" %}
[9]: http://www.firebirdsql.org/
[10]: http://www.firebirdsql.org/index.php?op=devel&sub=engine
[11]: http://www.firebirdsql.org/index.php?op=files&id=engine_250
[12]: http://www.firebirdsql.org/index.php?op=events