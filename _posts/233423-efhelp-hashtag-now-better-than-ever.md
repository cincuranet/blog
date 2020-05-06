---
title: |-
  #efhelp hashtag now better than ever
date: 2013-10-13T16:56:00Z
tags:
  - Entity Framework
  - Twitter
---
The `#efhelp` hashtag on Twitter is now back (not that it was ever off, just slightly crippled).

<!-- excerpt -->

The [original][1] implementation worked in a quick'n'dirty way. It fetched RSS feed for `#efhelp` search and pushed it through [Yahoo Pipes][2] to create a new feed (basically creating RT with a link) and this one was re-published into [@EFHelp account][3] (motivation for this can be found there too). This stopped working months ago as Twitter made all these feeds obsolete. I finally found the time and will :) to use the new Twitter API. Well actually to find and use some library. I was also not into creating new application in Twitter and all this [OAuth][4] stuff. And of course where to run it.

But it's over. The new application is simply fetching all `#efhelp` tagged tweets and retweeting (real retweet, so it's easier to get into conversation with questioner) under @EFHelp. I'm checking the search few times per hour, so it's not instantenous, but should be quick enough.

I hope you'll enjoy this new functionality. Also now with full Twitter API we can do whatever we want, just tell me. For example I'm thinking about retweeting [`entity-framework` tag from StackOverflow][5].

[1]: {{ include "post_link" 232567 }}
[2]: http://pipes.yahoo.com
[3]: https://twitter.com/efhelp
[4]: http://en.wikipedia.org/wiki/OAuth
[5]: http://stackoverflow.com/questions/tagged/entity-framework