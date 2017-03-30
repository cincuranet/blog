---
title: |-
  Second feelings about the new SSD
date: 2010-03-02T21:19:17Z
tags:
  - Storage &amp; Backup
  - Virtualization
  - Windows
layout: post
---
Let's call it a day. I'm now running my new Intel X25-M SSD for a little bit more than a day, but more importantly one working day. Shortly, I'm pleased.

I don't know, maybe my expectations yesterday were too high or maybe I wasn't just observing (or had no time) the useful stuff. And as correctly this morning my friend [Petr Kaleta][1] pointed, I'm not only comparing the disk itself, but also the rest of the system (Dell Latitude D620), whether it's able to keep up with the disk.

Anyway new observation from today is seeking. Simply forgot about it. First you not hear it - no moving heads, no sound. So somewhere in background you feel something is different. And other fact is that the "seeking" is so fast, you'll waste other time checking email etc. My Opera, right now with 30 tabs, starts with same speed as empty Chromium was doing on old disk. And it's not only about the start, when you see the application it's ready to work with. The post-start processes are already done. Same with Outlook. It behaves really instantly when switching folders, searching, checking calendar etc.

Other piece I noticed is working with virtual machines. You know, I run all my development environment in VMs, hence I stress it a lot. The start up is roughly two times faster as [I wrote yesterday][2]. The suspend is even faster. But when you suspend one and start another it's significant. Normally I was waiting a long time, the disk was overloaded. Now, it doesn't matter. Same speed.

Another chapter is working inside the VM. The applications there are working faster, thanks to the good seeking behavior. The Visual Studio 2010 RC there starts in under 10 seconds (loading solution with one DAL and BL library and one console application). The first compilation is about four times faster, subsequent ones are not such a big improvement as good piece of work is CPU bound. I like this improvement a lot.

The battery life seems to be about 50% better. It depends very on what you're doing (and in what shape your battery is), and I even don't remember exactly how quickly was my battery discharging before. So it's based on my estimate how many tasks I was able to solve before need to recharge. :) Bear with me.

Last stuff I was carefully observing was installation of Opera 10.50, which came out today. After 15-20 seconds the installation was done. The progress bar flew couple times from left to right. I put this down again to great seeking times (the installation pack is around 10MB, no huge data).

The rest of work is more pleasant. It's not lightning fast (as I expected for the first time - I know it's not RAM, beat me :)), but your not waiting for the disk too much. And maybe it's just me, but I feel more relaxed when the machine waits for me not vice versa. :D

If you have any questions or you want me to test something, let me know, I'll try my best. Oh, for true geeks, I'm running `SSDSA2M160G2GC` (model code) or `SSDSA2MH160G2XX` (product code) Intel X25-M 34nm SATA SSD.

[1]: http://twitter.com/PetrKaleta
[2]: {% post_url 2010-03-01-231271-new-ssd-intel-x25-m-first-feelings %}