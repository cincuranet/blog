---
title: |-
  Migrated from Disqus to utteranc.es
date: 2021-03-10T18:59:00Z
tags:
  - Blog
---
In last 24 hours I migrated from Disqus to _utteranc.es_ because I'm done with Disqus. I didn't mind it initially, but last few years I was more and more unhappy about it. Here's why and how I migrated.

<!-- excerpt -->

The reason why I was considering migrating away was because of my feeling of Disqus becoming bloated, slow and kind of intrusive. Also, from time to time I had problems with (my) email replies (which by the way is a great feature) not showing on the web. And I hate unreliable features. 

But every time I considered migrating away, I faced two problems. First, I don't want to pay for the commenting system. I know, I'm cheap. But in defense I'm publishing technical topics mostly - there might be a one question once a month about under some topic or correction of some mistake I did, and that's it. Paying more than a dollar or euro would be too much for me. In addition, it meant migrating the comments. And sure, some systems offer Disqus import, however I wanted to do some very small cleanup as well.

The last drop was when I found out this week, I missed few (interesting) comments from last 5 or so months. Done. I was ready. 

Few months back I stumbled upon a product that was using GitHub issues as a storage _and_ had a nice, smooth, polished execution. The problem was I forgot the name. Luckily after some googling I found it - [_utteranc.es_][1].

Also, while googling I found a [.NET/C# tool][2] that processes the Disqus export file and imports it into GitHub issues to be then used by _utteranc.es_. With a few small tweaks I started the import - failed few times because I triggered GitHub's abuse/rate limiting mechanisms (sorry GitHub) along with a damn Windows Update reboot during the night while the tool was slowly importing (thanks Windows Update, not) - and it was ready for switch.

Now, less than 24 hours after I angrily started, the comments below are running using _utteranc.es_ and I'm happy. 

Leave me a comment!

[1]: https://utteranc.es/
[2]: https://github.com/JuergenGutsch/disqus-to-github-issues