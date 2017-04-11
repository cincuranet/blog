---
title: |-
  Update Model from Database and CatalogName
date: 2008-11-28T14:40:00Z
tags:
  - Entity Framework
  - Firebird
  - Visual Studio
layout: post
---
Entity Framework support for Firebird had a problem, when you created model and then tried to update model (_Update Model from Database_) VS would freeze. I was pretty sure, that's a problem of server - because I was using 2.5 build from `HEAD` that cannot be considered as stable and the 2.1 was working fine (except the left outer join problem ;)) (because foreign keys/associations were not generated the problem wasn't fired). And I was wrong.

Similar to problem I described on [http://forums.microsoft.com/MSDN/ShowPost.aspx?siteid=1&PostID=3519267][1], the problem was in `NULL` in `CatalogName` in `DefiningQuery` in SSDL for store. Funny is that generating model from EdmGen and also in wizard was working fine, only updating was failing. But no exception, no error, nothing. Just freeze. If I had `NULL` in `SchemaName` I was getting exception in EdmGen leastways.

OK, now - just to be safe - `CatalogName` and also `SchemaName` isn't `NULL`, but dummy string. No attempts to be smart. ;)

Never mind, could be worse. Now it's fixed, so you can grab build from [http://netprovider.cincura.net/][2] and test it. Eh, and if you're looking for some FB with fixed left outer join, check i.e. [http://cid-bdb67deba4c656e5.skydrive.live.com/self.aspx/Ve%c5%99ejn%c3%a9/FB%7C_FixedLeftOuterJoin/Firebird-2.5.0.21381-0%7C_Win32.zip][3], it's a snapshot of current 2.5 `trunk`.

_This problem itself has been also discussed in comments [here][4]._

[1]: http://forums.microsoft.com/MSDN/ShowPost.aspx?siteid=1&PostID=3519267
[2]: http://netprovider.cincura.net/
[3]: http://cid-bdb67deba4c656e5.skydrive.live.com/self.aspx/Ve%c5%99ejn%c3%a9/FB%7C_FixedLeftOuterJoin/Firebird-2.5.0.21381-0%7C_Win32.zip
[4]: {% post_url 0000-00-00-228524-timeout-for-wait-transactions-in-firebirdclient %}/