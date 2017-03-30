---
title: |-
  FileStream.Length and what I learned
date: 2014-11-24T05:43:00Z
tags:
  - .NET
  - Azure
  - Performance
layout: post
---
I'm writing a tool that has, at the core, only one task. Upload file or files to the [Azure blob][7] as fast and as efficiently as possible. Nothing special overall. The devil is in details. As usual.

<!-- excerpt -->

The upload is obviously done in slices into blocks. At one part I'm looping though the slices and processing (uploading, progress reporting, check sums, etc.). Part of that loop is also reading [`FileStream`][1]'s property [`Length`][2]. As I was pushing the performance and also testing it on remote file systems ([SMB/CIFS][3]) sometimes the program ended with [`IOException`][4] saying `The semaphore timeout period has expired.`. Because I wrote [my own semaphore][5] I was first confused, looking for a clue in my implementation. But when I checked the call stack carefully I saw the exception originating from `Length`'s getter. Quick look at [implementation][6] and it was clear. Every call to this property does P/Invoke call to Win32. And it makes sense. The size of file might change during, so it cannot cache it. And I was reading it a lot during the loop.

Luckily for me I knew the size cannot change as I'm having exclusive lock on the file. I extracted it into local variable and tested. Not only it worked slightly faster (at this stage of coding every small speedup matters for me), but it also finished without an exception.

Although the `FileStream.Length` property behavior is completely clear I haven't thought about it until I experienced it. I love when something that obvious connects dots in my head.  

[1]: http://msdn.microsoft.com/en-us/library/system.io.filestream%28v=vs.110%29.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.io.filestream.length(v=vs.110).aspx
[3]: http://en.wikipedia.org/wiki/Server_Message_Block
[4]: http://msdn.microsoft.com/en-us/library/system.io.ioexception%28v=vs.110%29.aspx
[5]: {% post_url 2014-10-30-233486-async-semaphore-with-priority-rethinking-queuing-continuations %}
[6]: http://referencesource.microsoft.com/mscorlib/system/io/filestream.cs.html#fa88edfdb51ed91c
[7]: http://azure.microsoft.com/en-us/services/storage/