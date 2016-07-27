---
title: "Testing NDepend on FirebirdClient"
date: 2016-06-06T14:48:00Z
tags:
  - .NET
  - Firebird
  - Visual Studio
redirect_from: /id/233563/
layout: post
---
Couple of weeks ago [Patrick Smacchia][1] reached to me and offered me a license for [NDepend][1]. At that time I was actually in some code cleanup in [Fast 5 software][2] and though it might be handy to try it. As usual a lot of other things took priority and only now I'm  able to start playing with it. Because I needed some codebase that's not huge and also not small, I took [FirebirdClient][3] (both ADO.NET provider as well as EF6 provider). It's open source so you can try it yourself and it contains some ~10 years old code so there will be something to look at, for sure.

<!-- excerpt -->

Because it's NDepend, I have to look at dependencies graph, right? Here it is (you might open the raw image and scroll a lot).

[![Dependecies]({{ site.address }}/i/233563/current/deps_thumb.png)]({{ site.address }}/i/233563/current/deps.png)

Yes, the layering is not perfect. But it's not crappy either, is it? Occasional runs with chainsaw causing breaking changes are paying back. At least here. 8-)

Also some metrics were collected. The 5.0.5.0 version has:

* 13 586 LOC
* 243 types
* 2642 methods
* 485 files

All this in 213 source files. And there's much more in the generated [report][4].

Then I found a feature to compare two versions of sources and draw some statistics from that. Very interesting are rules around [_API Breaking Changes_][5]. Although I'm trying to be pretty organized with FirebirdClient, especially when there's a breaking change it is discussed upfront, something might slip in. For big projects, this I see as a useful safety net.

So. I took the version 4.0.0.0 and compared it with 5.0.5.0 (because I had that in hands already). Basically looking to see what changed between two major versions. Heck I don't even remember what was the major theme in 4.x anymore. :) [Here's][6] the report (this time only ADO.NET provider itself).

Interesting that even the functionality was added in general, all the cleanup around resulted in loss of LOC 4,62%, types 2,25%, methods 11,04% and files 2,82%. Only namespaces (one to be precise (the support for Firebird 3's protocol)) were added 7,14%.

Some other numbers I though might be interesting too.

Code size:

![Code size]({{ site.address }}/i/233563/compare/code_size.png)

Code numbers - maximums and averages:

![Code numbers - maximums and averages]({{ site.address }}/i/233563/compare/maximum_average.png)

Third-party assemblies usages:

![Third-party assemblies usages]({{ site.address }}/i/233563/compare/3usage.png)

I know looking at the report that there are some _critical_ rules violated. Some might be right. Some (maybe even bigger part) not, in my opinion. Not that these rules are wrong. For generic code they make sense. Here's it's often enforced by environment. But if you feel like tackling some of them, feel free to [issue a PR][7].

[1]: http://www.ndepend.com/
[2]: http://www.sms-timing.com/karting-software
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: {{ site.address }}/i/233563/current/NDependOut/NDependReport.html
[5]: http://www.ndepend.com/default-rules/webframe.html
[6]: {{ site.address }}/i/233563/compare/NDependOut/NDependReport.html
[7]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/pulls