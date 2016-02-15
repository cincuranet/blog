---
title: "PAUSE command moral"
date: 2010-12-14T13:39:57Z
tags:
  - Batch files
  - Windows
redirect_from: /id/232216/
category: none
layout: post
---
Few days ago I created batch file to backup [Firebird][1] databases, [Subversion][2] repositories and some other data on a new server. During the testing of the script I put `PAUSE` command at the end, to see the result (or better to say errors). After I was done with polishing it up I created record in [Task Scheduler][3] and started test run. Everything finished in a couple of minutes nicely. I left it there, expecting it to do the backup during the night, as scheduled.

Next day I checked the result and the task failed with `0x8004131F` aka `SCHED_E_ALREADY_RUNNING`. I checked CPU and disk utilization and it was clear the backup is not running. Kind of confused I ran backup manually and waited another day. And guess what, same error. As you probably now see, the problem was the `PAUSE` command at the end of the script. So the task was actually running, and waiting for the input. Clearly visible in [Process Explorer][4].

I removed it and now everything works fine. Such a stupid mistake caused such a confusion. :)

[1]: http://www.firebirdsql.org
[2]: http://subversion.apache.org/
[3]: http://msdn.microsoft.com/en-us/library/aa383614.aspx
[4]: http://technet.microsoft.com/en-us/sysinternals/bb896653
