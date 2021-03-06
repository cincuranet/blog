---
title: |-
  Problem waking up computer from sleep
date: 2011-09-22T18:48:57Z
tags:
  - VMware
---
I recently upgraded [VMware Workstation][1] to version 8 (it also runs Windows 8 nicely) and experienced one problem with putting my laptop to sleep.

The problem was, whenever I closed (suspended) the VM and put laptop to sleep, later when woke it up, it started booting from scratch. It was properly in sleep as the LED was blinking as usual, even the few moments (half a second or so) after waking up it was behaving correctly, at least from what LEDs were doing.

Because I'm putting my laptop (Dell Latitude D620) to sleep all the time, it was a serious problem for me. I did some "debugging" and found conditions for this to happen as well as a solution. I was able to reproduce the problem after taking VM created in VMware Workstation 7, changing HW level to 8 and upgrading VMware tools. Don't know whether it's absolute root cause, but it was just enough to reproduce the problem.

The solution (except avoiding changes above, but maybe the clean VM with HW level 8 and latest VMware tools will result in same problem) is easy. Because the laptop until starting the wake up procedure was behaving as expected, my focus was to CPU. After changing the CPU `Virtualization engine` mode from `Automatic` to `Intel VT-x or AMD-V` (I have Intel Core 2 Duo) the problem disappeared.

Hard to say what was VMware doing with CPU that even after closing it it was in such a state, but I'm happy to have normal behavior back. If you're experiencing same issue, hope this works for you too.

[1]: http://www.vmware.com/products/workstation/