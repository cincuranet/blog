---
title: |
  Lesson learned when installing Windows service using WiX
date: 2013-05-31T12:25:32Z
tags:
  - Lessons learned
  - PowerShell
  - Windows
  - WiX
layout: post
---
As I was creating, few months back, some Windows service I also created `MSI` installer, using [WiX][1], for it. Pretty straightforward – bunch of files in one `Component` plus `ServiceInstall` and `ServiceControl`. Then as the service started to gain some features I had referenced some assemblies. So I had to always update the installer script to include new files. This turned out to be main problem, because I forgot it quite a few times. So I decided to script it.

<!-- excerpt -->

Scripting is good. At least if done properly. :) In my case I made a small mistake. I created a simple [PowerShell][2] script that loaded the `WXS` file, listed all `*.dll`/`*.exe` files in `bin` directory (plus some other files) and created items in `Component`. Nothing special. Right? It only had a one small gotcha. I'm pretty sure it's described in documentation very likely, but ... you know. The problem was that the script was creating the items in `Component` in no particular order. To be precise it was listing the files and adding lines like stack. And last files processed were the other files. The installer was created fine, no error. Even the installation went well. Until it reached the point where the service should be started. It was failing. Consistently. Of course I was really installing (I mean finishing the installation) few weeks after I did this refactoring. Before, just seeing it started was fine for me. And I had no clue what's going on. I compared the old `WXS` file with new one. Except for formatting and some ordering it was same. [Event Log][3] was saying nothing. Full verbose logging install was not giving any clue. After like two hours wasted I was getting out of bullets. But then I realized something. The `ServiceInstall` nor `ServiceControl` element has a "reference" to the service executable. How's the installer going to know what service to install and run? Yes, the service executable needs to be first in list of files. When I realized it I knew I read it somewhere. Quickly fixing the PowerShell script and I was fine.

Although I thought my "refactoring" was fine, because the all the files were there and the installer even installed these, I messed the order. Order matters. Lesson learned.

[1]: http://wixtoolset.org/
[2]: http://www.microsoft.com/powershell
[3]: http://en.wikipedia.org/wiki/Event_Viewer