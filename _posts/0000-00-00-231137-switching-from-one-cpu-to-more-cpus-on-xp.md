---
title: |-
  Switching from one CPU to more CPUs on XP
date: 2010-01-02T19:34:11Z
tags:
  - Virtualization
  - Windows
layout: post
---
As I recently [switched from Virtual PC to VMWare Workstation][1] I wanted to upgrade my VMs to be able to use all cores I have and I granted. Machines I'm using most are Windows XPs and Windows 7. As the [Windows 7 migration failed][2] and I'm still about to install fresh W7 RTM, the challenge was XP.

Couple of hints I found on internet and as replies to [my question in mailing list][3] but nothing was working or it was screwing the system. But then I found [a great document][4], with the manual, forced, way of switching. Although the document recommends doing the surgery in safe mode, I did it in live system (vivat snapshots) once, with just raw copy (+overwrite) and it worked.

```text
copy C:\WindowsServicePackFilesi386halmacpi.dll C:\Windowssystem32HAL.DLL
copy C:\WindowsServicePackFilesi386ntkrnlmp.exe C:\Windowssystem32ntoskrnl.exe
copy C:\WindowsServicePackFilesi386ntkrpamp.exe C:\Windowssystem32ntkrnlpa.exe
```

Anyway, on real important system I would recommend safe mode too. After reboot the system detected new hardware, installed it and after another reboot I was ready to make the cores screaming.

[1]: {% include post_id_link.txt id="231004" %}
[2]: {% include post_id_link.txt id="231004" %}
[3]: http://konference.vyvojar.cz/post.aspx?id=211460
[4]: http://handaware.com/multiprocessor_XP.html