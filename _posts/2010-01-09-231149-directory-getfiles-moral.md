---
title: |-
  Directory.GetFiles moral
date: 2010-01-09T09:09:29Z
tags:
  - .NET
  - Programming in general
layout: post
---
Oh yes. I have here another moral. And it's not good for me, because it's (again) described in documentation (but who reads it when there's nice IntelliSense?). In my program [ID3 renamer][1] I have couple of custom IO operations. One of fundamental methods is for enumerating directory(ies) for all MP3 files. It's based on [Directory.GetFiles][2] and few functions inside [ID3 renamer][3] need exact order of files. One of these functions is [FreeDB search][4]. When I was renaming files on my network share, it wasn't finding anything. But when moving the directory to local drive everything was fine.

After some debugging I found, that the ordering of files from network share is different than from local drive. If you look to documentation you see:

> The order of the returned file names is not guaranteed; use the Sort() method if a specific sort order is required.

Ahh, there's your problem. :) Sadly enough, the ordering from local drive looks stable and it's based on filename as expected. Thus in a lot of cases you'll not smell that something may go wrong. But on non local drives (for me my NAS) you'll hit this immediately.

Never mind, could be worse (my first shot was some bug in my "MP3File" class and that will be really bad, as it could break users' files). This can be fixed easily.

[1]: http://www.id3renamer.com/
[2]: http://msdn.microsoft.com/en-us/library/ms143316.aspx
[3]: http://www.ID3renamer.com/
[4]: http://www.id3renamer.com/help/Writing/feature_freedb.htm