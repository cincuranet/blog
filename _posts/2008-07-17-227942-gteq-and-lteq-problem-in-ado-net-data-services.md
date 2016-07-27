---
title: "gteq and lteq problem in ADO.NET Data Services"
date: 2008-07-17T21:56:00Z
tags:
  - Entity Framework
  - OData/Data Services (Astoria)
redirect_from: /id/227942/
layout: post
---
If you're looking to some articles/resources/documents you may find, that "greater than or equal" or "lower than or equal" operators have keywords `gteq` or `lteq`. But when you try these, the request fails.

Well, the simple reason is, that these operators are in fact `ge` or `le`. Hope this helps you save some time when trying to find out what's wrong.