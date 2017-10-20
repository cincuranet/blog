---
title: |-
  Using Azure CDN for complete static (running) website
date: 2017-10-20T13:26:00Z
tags:
  - Azure
  - CDN
  - Cloud
---
If you read the documentation etc. for Azure CDN, it often expects that you're going to use it on parts of your website and rest will be served directly from the original location. But if you have completely static (and currently running) website, like for example this blog, which is using the Azure CDN actually, you need to take a few specific steps to start using Azure CDN in such a setup and without downtime.

<!-- excerpt -->

#### Terminology

For this blog post I'm going to use `www.example.com` as a domain for the website and `example.azurewebsites.net` as a name for the Web App where the website is hosted. The CDN endpoint will be `example.azureedge.net`.

#### Step 1

As a first step, because it needs some time to propagate, you need to create verification CNAME record on your DNS. Create `cdnverify.www.example.com` `CNAME` record that points to `cdnverify.example.azureedge.net`.

This will help us verify the domain later on, while the CDN is still being created.

#### Step 2

Create an CDN profile in Azure and create an endpoint. While setting up the endpoint, use custom origin and `example.azurewebsites.net` as an origin. Use `Host` header depends on your configuration, i.e. redirects. Generally, `www.example.com`. 

This might look weird, because a lot of tutorials etc. will tell you to use the `www.example.com` domain as an origin (or select from the menu correct Web App). Because we want to use CDN for the whole domain, you can't use the domain as origin. The fetching would then end up in an infinite loop.

#### Step 3

Set the custom domain for the endpoint to be `www.example.com`. This is where the _Step 1_ comes handy because you're not ready to change the DNS for the domain itself. Depending on state of DNS propagation you might wait few minutes or hours before completing this step.

#### Step 4

Enable HTTPS for the CDN. This is as simple as flipping the switch in Azure portal and waiting for the verification and certificate installation. The verification is well described, and it's the same process no matter what kind of CDN setup you're trying to do, so I'm not going to describe it here. The certificate installation and propagation on all POP nodes takes a while (basically hours). I usually do this as a last thing before leaving my office and continuing the next day.

Although this is optional, nowadays I expect every website to have HTTPS enabled.

#### Step 5

Now you can finally change the DNS for `www.example.com` pointing it to, via CNAME, to `example.azureedge.net`. After this you can delete the original `cdnverify.www.example.com` record (although it's not going to break anything if left there).

#### Summary

And you're done. If you followed these steps no downtime should happen and after a few minutes or hours and the website will slowly become available via CDN, hopefully faster for the end users.