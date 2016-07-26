---
title: "DbProviderFactories and machine.config in Framework/Framework64 fun"
date: 2012-09-11T18:43:22Z
tags:
  - .NET
  - Firebird
  - Life
redirect_from: /id/233005/
category: none
layout: post
---
Fun today. I was trying to use `FirebirdClientFactory` from [FirebirdClient][1] installed in GAC. Because it was used globally I was not editing `app.config`/`web.config` but `machine.config`. I went to `Framework` etc. directory and modified `machine.config`. And ... and it still wasn't working. Fast forward, I spent maybe an hour trying to figure out what's wrong. I was hopeless. Everything seemed fine. Randomly cd-ing through directories and thinking what I'm missing, I realized I didn't modified `machine.config` in `Framework64`. Stupid mistake.

Sure after I corrected myself everything started working. Hope my story will save you time.

[1]: http://www.firebirdsql.org/en/net-provider