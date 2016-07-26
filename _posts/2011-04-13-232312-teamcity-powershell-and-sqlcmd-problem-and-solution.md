---
title: "TeamCity, PowerShell and sqlcmd problem (and solution)"
date: 2011-04-13T17:46:19Z
tags:
  - Continuous Integration
  - MS SQL Server
  - PowerShell
redirect_from: /id/232312/
category: none
layout: post
---
In my current project we're using [TeamCity][1] as a continuous integration server and [psake][2] to run all out build and deployment tasks. Part of the deployment is execution of SQL scripts to create database and create structures in it. And as a heavy-duty console user, I'm using sqlcmd to do all my work with database. So I simply called sqlcmd with according parameters and to execute the scripts. Sadly for some strange reason, the [PowerShell][3] runner in TeamCity kept running in a loop eventually ending with timeout. Even worse, running it locally directly in PowerShell was fine. After small research done by my [colleague][4] we found the reason is sqlcmd.

The quick'n'dirty solution was to run it using [Start-Process][5], sadly we lost the output (using `-NoNewWindow` resulted in same problem), so any error was about guessing. Simple techniques, like redirecting output from cmdlet ended with same problem.

But I actually found a solution. I redirected the output from sqlcmd directly with `-o` switch and used Unicode using `-u`. Then I echoed the file via [Get-Content][6] cmdlet with `-encoding Unicode` switch.

After I rigorously specified the encodings for output and input, everything started running fine. Probably there was some problem with BOM being in input, causing headache to the runner.

Never mind, now it's fine, and I'm happy, because I see errors in processing SQL scripts eventually.

[1]: http://www.jetbrains.com/teamcity/
[2]: https://github.com/JamesKovacs/psake
[3]: http://technet.microsoft.com/en-us/library/bb978526.aspx
[4]: http://rarous.net
[5]: http://technet.microsoft.com/en-us/library/dd347667.aspx
[6]: http://technet.microsoft.com/en-us/library/dd347719.aspx