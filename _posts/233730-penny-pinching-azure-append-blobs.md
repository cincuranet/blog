---
title: |-
  Penny pinching Azure Append Blobs
date: 2018-07-05T06:50:00Z
tags:
  - Azure
  - Azure Storage
  - Application Insights
---
I was going through some reports in Application Insights for a small website I'm running and I saw a lot of 409 errors when writing to Append Blobs. As I was sorting this out, I also realized I can do the whole logic more "efficient" and save some pennies.

<!-- excerpt -->

Little bit of context. The website I'm talking here about is collecting some data and putting it into [Append Blobs][1]. Because you can append data to a single Append Blob only so many times, every month new blob is created. This is where the 409 error was coming from, because for Append Blob there isn't simple `CreateIfNotExists` method, I had to build [my own "optimistic concurrency" way to do it I blogged about before][2].

These 409 errors were bugging me in [Application Insights][3]. Sure, I could filter those out, but it would still be there. :) Also, I realized most of the time the blob exists (because it's created only once a month), thus this call is often useless - it's slowing things down and also costing me some, although peanuts, money. And I can really easily solve both.

I simply pre-generated these blobs for next 20 years. Solved. The application can now assume the blob exists, saving one operation, hence saving time and money.

So, what's the lesson? If you can (use common sense) pre-generate it, pre-generate it. Like this blog, for example. :)

[1]: https://docs.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs
[2]: {{ include "post_link" 233597 }}
[3]: https://azure.microsoft.com/en-us/services/application-insights/