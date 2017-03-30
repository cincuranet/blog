---
title: |-
  Azure blob error "The specified blob or block content is invalid." even with "same" block IDs
date: 2014-01-05T08:17:00Z
tags:
  - Azure
  - Azure Storage
  - Cloud
  - Lessons learned
  - Storage &amp; Backup
layout: post
---
Last week I spent fair amount of time with error `The specified blob or block content is invalid.` while uploading to Azure blob in blocks. If you do a quick googling you'll find a lot of resources about fact that the block IDs need to be same of length. With maybe more googling you'll find error codes and find [`InvalidBlockId`][1] might seem more appropriate for this. But this is a false path. While going through first results you'll sooner or later find quite [good article][2].

<!-- excerpt -->

And you'll read (read: I read) the short version saying, at that time already known fact, that the block IDs need to be of same length. I read that couple of times, checked my code even more times and my block IDs were of same length, indeed. Only after few hours I read complete article including the "long version". And then it kicked me. My block IDs were of same length _in the current session/run of application_. But as I was debugging it, I also put there bunch of blocks with "random" IDs. These were different length. Silly me. I quickly comfirmed that fetching uncommitted blocks. Bang. Deleted the whole blob and started again. And it went smoothly now.

So there are two morals from this. Always read whole blog post (if you're here, good job :)). And always think outside the single "run" of application you're currently writing/debugging; the state might be there.

[1]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storageclient.bloberrorcodestrings.invalidblockid.aspx
[2]: http://gauravmantri.com/2013/05/18/windows-azure-blob-storage-dealing-with-the-specified-blob-or-block-content-is-invalid-error/