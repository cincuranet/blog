---
title: "Sad story about cloud CDNs"
date: 2016-10-18T04:53:00Z
tags:
  - Cloud
  - CDN
  - Azure
  - AWS
redirect_from: /id/233579/
layout: post
---
Yesterday I started a simple task. Or at least I thought it was simple. Basically I needed to prepend some CDN in front of a domain with static content. In what a hole I ended... 

<!-- excerpt -->

My immediate attempt was targeted towards Azure. I have a couple of projects there. I explore various services there, if I have a time. So I went to portal, created new CDN profile and went to assign custom domain. Around these steps I realized there's nothing about SSL certificates in the blades. As I finished assigning custom domain, with the hope some SSL menu will show up, I found nothing. Not for Verizon nor Akamai plan. Bravely I searched and found [this][1]. Yep. You read it correctly. It's not supported and - from the history - it was shifted couple of times.

Alrighty.

So what about AWS. The CloudFront, from the start, felt solid. I felt it's going to happen here. I first created _Distribution_ without certificate, just to get started. Then I tried creating one with SSL certificate, which I previously saw was there. Quick jump to _Certificate Manager_ to import the certificate. Click, click. 

```text
The private key length is not supported. Only 1024-bit and 2048-bit are allowed. Choose Previous button below and fix it.
```

Really? This is where it ends?

It's difficult to wrap my head around, why my simple - custom domain and SSL (of course) - needs are so difficult even for two biggest cloud providers, where I would expect the best support for everything. So, defeated, I'm searching for other providers. 

[1]: https://feedback.azure.com/forums/169397-cdn/suggestions/1332683-allow-https-for-custom-cdn-domain-names