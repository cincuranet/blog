---
title: "My \"read later\" bookmarklet for Instapaper working in Opera"
date: 2011-03-02T20:11:45Z
tags:
  - Amazon Kindle
  - Browsers
  - JavaScript
  - Opera
  - Web
redirect_from: /id/232259/
category: none
layout: post
---
Before I used [Instapaper][1] I had a 30+ tabs opened in [Opera][2]. And I was used to that, though whoever saw it was asking me how I work in Opera with this amount of tabs. :) But to get the content into [Kindle][3] to be able to comfortably read it I started using Instapaper. Sadly in recent version of Opera the "Read Later" bookmarklet stopped working (yes, it's reported to Opera). Not good, I'm pushing through it a lot of articles into Instapaper or Kindle respectively.

After some time of adding links manually I decided to look for some API and create "something". Luckily there's a "simple API" available, just adding via HTTP call. Exactly what I need. I dusted down my JavaScript "skills" ;) and created raw and dirty bookmarklet.

```javascript
javascript:{ var username = '<your username>'; var password = '<your password>'; window.open('https://www.instapaper.com/api/add?username=' + username + '&password=' + password + '&url=' + encodeURIComponent(window.location.href)); window.close(); }
```

At the beginning there are two variables to put your username and password. The code does what fits my needs best. Opens new tab issuing request to Instapaper and closing current one (because I'll read it later 8-)). Raw return code is processed with my brain, no fancy popups or anything like that. `201` means OK; everything else means "check Instapaper".

Improvements are welcome.

[1]: http://www.instapaper.com
[2]: http://www.opera.com
[3]: http://www.kindle.com
