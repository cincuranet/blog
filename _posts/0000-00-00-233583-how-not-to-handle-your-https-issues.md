---
title: |-
  How not to handle your HTTPS issues
date: 2016-11-09T20:19:00Z
tags:
  - Encryption
  - Cryptography
  - Best practice or not?
---
What could possibly go wrong when you expect HTTPS for signing in... I was handling new version of my client's application which was hosted on [HostForLIFE.eu][1]. That just mean logging into the admin panel and uploading new deployment. Simple as that. As I was accessing the admin panel I spotted it's not running on HTTPS, which honestly is a big no-no for me in 2016. So I filled a support ticket an asked whether that would be possible. Maybe different URL or IP. What the brought is unbelievable.

<!-- excerpt -->

Here's the screenshot of that ticket.

![Support ticket]({% include post_ilink post=page name="ticket.jpg" %})

What? I mean WHAAAT? It's fucking not! It's a good old `<form>` that is `POST`ing the values to the server. Every script kiddie can handle that.

With that "solution" in my hands I turned over, moved the website to my own server and cancelled the account. This is not an inconvenience. It's a pure ignorance. Wrong attitude. 

Eventually they told me I can access it via HTTPS, although I would have to accept self-signed certificate (without at least trying to send me the fingerprint for manual validation (not that it matters because the support platform was on plain HTTP anyway)). Hard to chew that if you can get free certificate from Let's Encrypt.

If you want to know what others think, [here's a tweet][2] I posted yesterday.

What do you think? Is this acceptable in 2016? Or am I too picky?

[1]: http://hostforlife.eu/
[2]: https://twitter.com/cincura_net/status/795719590017900546