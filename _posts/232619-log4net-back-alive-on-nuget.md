---
title: |-
  log4net (back) alive on NuGet
date: 2011-12-21T17:11:19Z
tags:
  - Logging &amp; Tracing
  - NuGet
---
It turned out, that the previous maintainer of [log4net NuGet package][1] [@dotnetjunky][2] was assigned mistakenly. So nobody was actually maintaining that package. After few messages with him, we decided, I'll take over the ownership and maintain it.

I still use [NLog][3] in my projects, as I like it a little bit more. But I know, there's big community around log4net, with my coworker [Ales][4] included. :)

Today I uploaded package with new version 1.2.11 (I used the binaries [signed with new key][5] so any new dependencies will follow this recommended usage), and I'll try my best to keep the package up-to-date. Enjoy.

[1]: http://nuget.org/packages/log4net
[2]: http://twitter.com/dotnetjunky
[3]: http://nlog-project.org/
[4]: http://rarous.net/
[5]: http://logging.apache.org/log4net/release/faq.html#two-snks