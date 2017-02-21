---
title: |
  Firebird (server) is back in business with Entity Framework
date: 2008-10-06T16:37:00Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - Visual Studio
layout: post
---
As you (maybe) know, there was a bug in `left outer join` so the model generation/update etc. in Entity Framework and similar tools was failing. The bug is now gone. Well, it's not in some oficial release, but it's in sources. If you want to test it, grab sources and build or grab [this build][1] (only SuperServer executable). Also take into accout, that it's build from current sources and can be _very unstable_.

[1]: http://cid-bdb67deba4c656e5.skydrive.live.com/self.aspx/Ve%c5%99ejn%c3%a9/FB%7C_FixedLeftOuterJoin/fbserver.7z