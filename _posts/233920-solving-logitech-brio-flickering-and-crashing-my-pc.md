---
title: |-
  Solving Logitech Brio flickering and crashing my PC
date: 2023-05-03T09:43:00Z
tags:
  - Hardware
  - Webcams
  - USB
---
For my day to day calls I'm using Logitech Brio webcam. It provides very decent picture quality and I like using Windows Hello for unlocking my PC. But I was experiencing major issues. Here's a (weird) solution that worked for me.

<!-- excerpt -->

Smaller of two problem was image flickering. It looked like analog artifacts. Here's an example.

![Brio flickering]({{ include "post_ilink" page "brio_flicker.png" }})

Sometimes it happened few times per call, sometimes if was few times per minute. It was annoying at least (especially for the other side(s)).

The bigger problem was that my PC kept crashing, during calls only. Or actually everything froze - screen, sound, ... and I had to hard reboot. I wasn't able to collect any dump, that made the troubleshooting harder. My initial suspect was GPU. But I later ruled that out because it was happening even with the on-board GPU. At some point I had to reboot 4 times during 25 minute call. I had enough.

Searching internet, trying different theories, trying to replicate the issue, replacing various cables and 37 reboots later I found what the solution was. And what a weird one.

In my setup the camera is connected to Dell U2722DE display and that in turn is conncted to USB port on back of the Dell Precision 3650 (my work PC). I used 10G USB port on the Dell Precision 3650, because screen supports it and more is better, right? As it turns out, this was causing the flickering and freezes. Plugging into 5G USB port on the Dell Precision 3650 solved the issue for me. Ever since, 2+ months now, I'm running without problems. Go figure...

I wish I could understand what was really happening under the cover, but on the other hand I'm happy it works without issues.
