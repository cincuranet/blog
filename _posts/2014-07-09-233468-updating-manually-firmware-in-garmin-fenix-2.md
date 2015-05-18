---
title: "Updating manually firmware in Garmin fēnix 2"
date: 2014-07-09T16:39:00Z
tags:
  - Garmin
  - Running
  - GPS
redirect_from: /id/233468/
category: none
layout: post
---
Last week I noticed new firmware for Garmin fēnix 2 being available. I was eager to load it into watch because I was having problems lately with satellite reception. I was not happy to open Garmin Express to update the firmware. The watch works as a standard [USB Mass Storage][2] so why the vendor forces me to use this program is a mystery.

Anyway as I started the Garmin Express it started updating itself and kept popping up the UAC prompts. After like twenty confirmations it finally started, but said there's no Garmin device connected. Heck it was, I just copied the `fit` files from it, it was charging and I saw the "Garmin drive". Couple of attempts later I gave up. Time to look how the update it done - I had strong feeling that it's just copying the file somewhere and that's it.

<!-- excerpt -->

Few minutes of magic with [Sysinternals tools][3] and [VMware Workstation][4] virtual machine and I was done. So here are the steps.

* Head to the [firmware page][1].
* Open the source view of page. Right at the beginning you'll find link for download. Currently it's `http://download.garmin.com/software/fenix2_330.gcd`.
* Download the file. :)
* Copy the file to your watch into `X:\Garmin\GUPDATE.GCD` (where `X` is Garmin's drive letter).
* Unplug the watch. It should (re)start and start updating.
* Done.

There's no data nor settings lost during the update (similar to "regular" update). As I said, that's what I found and what works for me. Do it at your own risk. No warranty. 8-) 

Hope Garmin will not change the procedure or will not hide the download location. Not that it would stop me, but it would be another work. :) 

[1]: http://www8.garmin.com/support/download_details.jsp?id=6929
[2]: http://en.wikipedia.org/wiki/USB_mass_storage_device_class
[3]: http://technet.microsoft.com/en-us/sysinternals/bb545021.aspx
[4]: http://www.vmware.com/products/workstation/