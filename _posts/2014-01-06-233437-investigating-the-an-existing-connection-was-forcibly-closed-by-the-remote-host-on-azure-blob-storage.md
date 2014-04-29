---
title: "Investigating the \"An existing connection was forcibly closed by the remote host\" on Azure Blob Storage"
date: 2014-01-06T13:49:00Z
tags:
  - Azure
  - Azure Storage
  - Cloud
  - Storage &amp; Backup
category: none
layout: post
---
As I was working on a side project that uses [Azure Blob Storage][1] to store some files I was getting `An existing connection was forcibly closed by the remote host` error while uploading, sometimes. And I had no idea why. There was nothing more specific in the exception(s) that would help me to get a clue.

<!-- excerpt -->

Because it was happening "sometimes" and I had no clue, I implemented simple retry logic and continued working on something else. Until I realized the problem is gone. I backtracked my steps and tried one change at a time to isolate what solved the problem.

Initially I was uploading blocks of 2MB in size. Doing about ten in parallel. Uploading that took little bit under a two minutes. Nothing interesting. At least I thought. By a coincidence I changed the block to 512KB and used only four connections. As it turned out that solved my problem with remote host (Azure) forcibly closing my connection.

I know there are some throttling policies on every Azure service (and I experienced it a lot on SQL Azure), but as far as I remember there was always something about it in exception. I was getting only simple [`IOException`][2] wrapped in [`StorageException`][3] (nothing was there if you'd like to ask ;)). Thus I'm not sure it was that. 

But using smaller blocks hence having the connections opened only for shorter time span and using less connections solved it. If you're experiencing the same issue, you can try that. It might help. Or not. :)

[1]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
[2]: http://msdn.microsoft.com/en-us/library/system.io.ioexception(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.storageexception.aspx