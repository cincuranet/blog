---
title: "#efhelp hashtag now better than ever"
date: 2013-10-13T16:56:00Z
tags:
  - Entity Framework
  - Twitter
category: none
layout: post
---
The `#efhelp` hashtag on Twitter is now back (not that it was ever off, just slightly crippled). 

<!-- excerpt -->

The <a href="{{ site.url }}{% post_url 2011-11-11-232567-improved-efhelp-hashtag-cooperation-with-efhelp %}">original</a> implementation worked in a quick'n'dirty way. It fetched RSS feed for `#efhelp` search and pushed it through <a href="http://pipes.yahoo.com">Yahoo Pipes</a> to create a new feed (basically creating RT with a link) and this one was re-published into <a href="https://twitter.com/efhelp">@EFHelp account</a> (motivation for this can be found there too). This stopped working months ago as Twitter made all these feeds obsolete. I finally found the time and will :) to use the new Twitter API. Well actually to find and use some library. I was also not into creating new application in Twitter and all this <a href="http://en.wikipedia.org/wiki/OAuth">OAuth</a> stuff. And of course where to run it. 

But it's over. The new application is simply fetching all `#efhelp` tagged tweets and retweeting (real retweet, so it's easier to get into conversation with questioner) under @EFHelp. I'm checking the search few times per hour, so it's not instantenous, but should be quick enough.

I hope you'll enjoy this new functionality. Also now with full Twitter API we can do whatever we want, just tell me. For example I'm thinking about retweeting <a href="http://stackoverflow.com/questions/tagged/entity-framework">`entity-framework` tag from StackOverflow</a>.