---
title: "Pushing upload limit on Azure to maximum without much effort"
date: 2014-05-11T15:15:00Z
tags:
  - Azure
  - Azure Storage
  - .NET
  - Storage &amp; Backup
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/233456/
category: none
layout: post
---
Last week I had pretty straightforward task. Issue few simple SQL commands and then copy roughly 800MB of data to Azure Blob Storage. Everything happening inside Azure. And do it in under 30 seconds. Hard limit.

My first shot with straight-to-the-case solution was looking promising. On average 28 seconds. Not much room for some glitch. Still, in the zone. Unfortunately during production run the glitches were sometimes bigger and I was dangling over in 31-32 seconds one or two times a week. Time for tuning.

<!-- excerpt -->

Simple timing and I knew SQL commands are not a problem. These were done in under 500ms. The upload was taking majority of the time. The upload was happening inside Azure in same datacenter/region. I also checked _affinity group_, because that's very important, but currently Azure Websites do not support it, so that was "just in case". 

So I was left with the upload itself. My feeling was that I'm not maxing out the "line" by just one stream. I might be able to squeeze few percent and get reliably under 30s. I wasn't in a mood to start writing my own asynchronous chunked upload and luckily the Azure Storage Client library already contains similar functionality. 

The [`BlobRequestOptions`][1] class has [`ParallelOperationThreadCount`][2] and [`SingleBlobUploadThresholdInBytes`][3]. I quickly tried parallel upload with 2 with big chunks (64MB in my case) and I was slightly faster indeed. Of course not an order of magnitude faster, but just few percent as I expected. But that was exactly what I needed.

Now I'm reliably in under 28s for about two weeks. Problem solved. At least for now. The file is getting _slightly_ bigger every week so maybe in a few months I'll be pretty close to 30s and scratching my head again. :)

[1]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.blob.blobrequestoptions(v=azure.10).aspx
[2]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.blob.blobrequestoptions.paralleloperationthreadcount(v=azure.10).aspx
[3]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storage.blob.blobrequestoptions.singleblobuploadthresholdinbytes(v=azure.10).aspx