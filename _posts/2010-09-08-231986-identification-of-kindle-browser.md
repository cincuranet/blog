---
title: "Identification of Kindle browser"
date: 2010-09-08T14:23:18Z
tags:
  - Amazon Kindle
redirect_from: /id/231986/
category: none
layout: post
---
New [Kindle 3][1] has also new browser. It's based on [WebKit][2] and I have to say, it's noticeably better than the previous one. The browsing, if the page is focused on text, is really pleasant.

However if you're webmaster or simply some website owner you might be wondering how the browser in Kindle identifies itself when accessing your page. Probably because you may consider showing mobile version of your site or you just wanna know how many visitors are accessing your page from Kindle.

Well, it's:

```text
Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600x800; rotate)
```

with current latest firmware (515460094). Exactly same identification is sent when the screen is in landscape mode.

[1]: http://www.amazon.com/Kindle-Wireless-Reading-Display-Globally/dp/B003FSUDM4
[2]: http://webkit.org/