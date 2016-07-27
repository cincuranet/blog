---
title: "PlayBook's browser identification"
date: 2011-05-21T12:50:50Z
tags:
  - BlackBerry
  - BlackBerry PlayBook
redirect_from: /id/232392/
layout: post
---
Similarly to my post about [Kindle's browser][1] I looked how the browser in PlayBook is identifying self.

With the latest OS 1.0.3.1868 the `User-Agent` string is:

```text
Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/0.0.1 Safari/534.11+
```

It contains "PlayBook", so it's easily grep-able.

[1]: {{ site.address }}{% post_url 2010-09-08-231986-identification-of-kindle-browser %}