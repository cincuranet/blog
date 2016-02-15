---
title: "Virtual PC ==> VMWare Workstation"
date: 2009-11-05T10:20:44Z
tags:
  - Virtualization
  - VMware
redirect_from: /id/231004/
category: none
layout: post
---
I've been using Virtual PC (2007) for a quite while and very heavily. In fact my entire development environment is in VMs. But I was getting more and more upset with Virtual PC. The version 2007 SP1 is/was kind of old, missing some new features and improvements. When testing the new [Windows Virtual PC][1] I felt like it's focused more on standard users and mainly to run some XP applications in Windows 7, not as a full size virtualization tool for advanced users (but I may be wrong, it's just feeling).

So I tested the [VMWare Workstation 7][2], couple of days ago. Shortly, I'm sold. It's much more mature (again my feeling), has really advanced features for geeks as me (like the snapshots – I created my own way with Virtual PC, but in VMWare Workstation it's much easier) and the Unity - I like it (I know Windows Virtual PC has this too, but VMWare Workstation seems to support more systems).

The migration was the only challenge. All my VMs in Virtual PC contained software and setups that I didn't want to reinstall from scratch. I'm running some XP boxes, where the migration was OK. I was just forced to do the activation again, but no problem. The Windows 7 (this instance was RC) it ended in BSOD. System suggested me some repair utility during next boot, but it didn't help. So the W7 system will be probably reinstalled, which isn't so bad, because I was planning to install the RTM, just little depressing. The Linux boxes, based mainly on some Live CDs, ran without problems. So the overall result is good, I think.

From the performance perspective, I can't judge the performance of VM itself. I was more or less happy with Virtual PC and I don't have some exact numbers to provide. But what's faster is saving and restoring the state of the machine and I'm using this a lot.

I hope I'll not find some critical problem that will make me hate the VMWare. :)

[1]: http://www.microsoft.com/windows/virtual-pc/
[2]: http://www.vmware.com/products/workstation/
