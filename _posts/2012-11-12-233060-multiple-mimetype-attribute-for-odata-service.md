---
title: "Multiple MimeType attribute for OData service"
date: 2012-11-12T09:42:15Z
tags:
  - OData/Data Services (Astoria)
redirect_from: /id/233060/
category: none
layout: post
---
I was recently doing my course on Entity Framework ([drop me a line][1], if you're interested) and the last day we were diving into WCF Data Services aka OData.

There's a [MimeType attribute][2] that allows you, simply speaking, set the MIME type for the output of some operation. That's great, because you can immediately provide i.e. `text/html` output where the HTML is saved in come column in database. But it's a fair need to want to specify the MIME type for operations you have. Sadly the MimeType attribute has to be on class and has `AllowMultiple = false`. Bummer.

After some poking around, research etc. I found that there's indeed a limitation that you currently cannot specify the MIME type for more than one operation. But good news is, that in future release(s) this limitation should be lifted.

Wondering how's possible I never thought about this myself before??? :)

[1]: {{ site.address }}/contact
[2]: http://msdn.microsoft.com/en-us/library/system.data.services.mimetypeattribute.aspx
