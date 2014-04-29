---
title: "Timestamp property on Windows Azure Table entity"
date: 2013-01-16T12:24:59Z
tags:
  - Azure
  - Azure Storage
  - Best practice or not?
  - Cloud
  - Lessons learned
category: none
layout: post
---
Every entity in [Azure Table Storage][1] has `PartitionKey`, `RowKey` and `Timestamp` property. `PartitionKey` gives the "bucket" where the entity will be stored (entities in one partition can be on more machines, though). And the `RowKey` is simply the key of that row. Queries where you're matching both keys are fast. Matches inside partition (you know `PartitionKey` but only part (or none) of `RowKey`) are slower. Cross partition matches even slower. You get the idea. But what about the `Timestamp`?

<!-- excerpt -->

The `Timestamp` property is maintained by server and it's the time the entity was last modified. Simple as it is. Because the property is always there, I thought it would be good to actually use it. But it's not. This property is not being "indexed" (not even slightly :)) or anything like that. That means any query including condition on it will be as slow as table scan (or any other property condition). And that's something very _very_ slow, especially if you have dozens of partitions with millions of records and you're doing range condition (not mentioning the limit on one batch for result). 

And I learned that by my experience. :) Because the [secondary indices are not here yet][2], the only option, if you're doing really a lot of queries based on date&time/last modified to (ab)use `RowKey` (or build and maintain secondary index yourself).

You might wonder how to create such secondary index. Easy, like in 1980s. You already have table (BTW did you noticed, how easy is to store something into table, but it's order of magnitude harder (read slower) to get something from it, except if you're doing `PartitionKey`&`RowKey` exact match?), if the inserts/updates/deletes are not super fast and you're not fighting for throughput you can compute the key for secondary index directly while doing the operation and store it in another table with both keys from original table. But if you need the operation to be super fast, you can just put the data into queue message (if it's too big for message (64kB in Jan 2013) you can put the data into blog and store just reference to blob) and use worker role(s) to process the data, compute secondary keys and insert/update/delete into table(s). Boring? Yes. Old school? Yes. But Azure Table Storage isn't exactly smart storage, but it scales. :)

Let's hope secondary indices (even stale would be good) will be added in the future.

[1]: http://www.windowsazure.com/en-us/home/tour/storage/
[2]: http://www.mygreatwindowsazureidea.com/forums/34192-windows-azure-feature-voting/suggestions/396314-support-secondary-indexes