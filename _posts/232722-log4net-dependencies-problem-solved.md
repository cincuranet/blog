---
title: |-
  log4net dependencies problem - solved
date: 2012-02-16T15:50:55Z
tags:
  - Logging &amp; Tracing
  - NuGet
---
OK, following log4net's versioning scheme [in NuGet package][1] wasn't a good idea. In version 1.2.11 the new keys were used and I used this as a fresh start. I didn't realized that thanks to [semantic versioning][2] everybody will be updated to latest version and dependencies will be broken. My fault. :-?

If you read my [previous log4net post][3] there's a solution with modifying `package.config` file, but... So to fix it package owners were forced to repack the dependencies to be `=`. Not good.

So today I pushed version 2.0.0, which is actually 1.2.11 with new keys, and 1.2.11 was removed. So there's now on [NuGet][4] the new _major_ version and dependencies need to be explicitly stated to be compatible with it (again, it's 1.2.11 with new keys).

Fire is quenched, hopefully.

[1]: {% include post_link, id: "232619" %}
[2]: http://semver.org/
[3]: {% include post_link, id: "232619" %}
[4]: http://nuget.org/