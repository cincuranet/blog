---
title: "Passing data between build steps in TeamCity"
date: 2015-03-18T20:23:00Z
tags:
  - TeamCity
  - Continuous Integration
redirect_from: /id/233501
category: none
layout: post
---
Recently I started automating crazy stuff on [TeamCity][1]. Basically everything that we were doing manually needs to be now automated. That brings challenges to itself as some "processes" are, well, crazy and I just needed to fit in. Unless I was up for complete rewrite (I was not).

<!-- excerpt -->

One pattern was repeating often. I needed to produce some value in one step and use it in other. Sadly that's nothing that's directly supported by TeamCity. Sure I could create bunch of files. Or one XML/JSON file. But that seemed like a lame solution. I hate lame solutions. I'm always up for a challenge.

But I eventually found a decent - for me - way to do it. And it's actually pretty simple too. It's using [script interaction with TeamCity][4] (via the `##teamcity` messages) and environment variables. Because these work between steps and you can easily process these in scripts.

So how it works? I'm using a lot of [PowerShell][3] and [Bash][2], I'll use PowerShell here. You're freely working during the step using the `$env:whatever`. Once you're done (or you want to persist the value) you put on the output `##teamcity[setParameter name='env.whatever' value='SNAFU :)']` message. TeamCity now knows about this variable and keeps it. When the new step is started the environment is restored with this variable's last known value. Suppose it's again PowerShell. You can then just read `$env:whatever` and the last known value will be there. Sweet!

The only drawback is that you should not forgot to signal the value with `setParameter`. Else it's lost and it's not that easy to track that down, especially with the steps in the middle.

[1]: https://www.jetbrains.com/teamcity/
[2]: http://en.wikipedia.org/wiki/Bash_%28Unix_shell%29
[3]: http://en.wikipedia.org/wiki/Windows_PowerShell
[4]: https://confluence.jetbrains.com/display/TCD9/Build+Script+Interaction+with+TeamCity