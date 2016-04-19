---
title: "Microsoft.Data.dll after crop"
date: 2010-08-04T06:06:44Z
tags:
  - .NET
  - Databases in general
redirect_from: /id/231885/
category: none
layout: post
---
Last 24 hours was interesting. Almost everybody doing something with databases and .NET was talking about new [Microsoft.Data.dll][1]. And there has been recently a lot of clarification (i.e. [this][2] or [this][3]) <small>(check your favorite search engine for more)</small> what it is and what it is not and who's target audience.

From what I read emerges that it's focused on starting developers who may not even be interested in being "real" developers. Somebody who wants to just put some site together and run. Be close to PHP <del>world</del> style of working. Together with [WebMatrix][4].

I'll not think about whether it's good for MS's ecosystem or not. Although I see the the points as valid, I still don't get it. If you're a beginner, really beginner and you wanna create some site, would you spend some time on creating it or rather try to install i.e. [WordPress][5]. It's probably the same challenge, but the result will be different. Not taking into account, that you would still need to have at least basic knowledge of (X)HTML, programming and databases and SQL when doing it on your own, isn't it? OK, so maybe the novice _just_ wants to create some site on his/her own. Learn something. Improve own skills. But all this stuff isn't going to give him/her touch of how it's really done. You'll be learning something that useless for bigger, real-world, applications. Umm, than he or she may not be interested in expanding skills, really just create something for fun, you might think. But do you really think this case exists? Doesn't it sooner or later fall into one of two categories above?

And the dynamic point of view? I read somewhere that the target audience is expected to use not so sophisticated editors etc. (BTW isn't Visual Studio Express free???). But that's not what bothers me. What bothers me, it's the lack of compile-time checking (which is what I damn like when I develop). You'll upload the site to web a you'll have to check a lot of code (pages) to see whether it works. The refactoring is harder; ahh damn, that's not what the target audience is going to be doing or will they? Don't forget the find&replace is refactoring as well, and here the compile time checking is really useful?

On the other hand, maybe it's a good idea, and only because we're not novices and the "product" isn't enterprise ready, we should understand it and try not to judge it with enterprise-ready eyes. Because we are maybe spinning in our own world not seeing outside the box. But I personally still think the idea how it's done it's wrong.

[1]: {{ site.address }}{% post_url 2010-08-03-231866-lets-try-something-new-what-about-microsoft-data-dll %}
[2]: http://weblogs.asp.net/davidfowler/archive/2010/08/03/microsoft-data-dll-a-re-introduction.aspx
[3]: http://search.twitter.com/search?phrase=Microsoft.Data&lang=all&from=cincura_net
[4]: http://www.asp.net/webmatrix
[5]: http://wordpress.org/
