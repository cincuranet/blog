---
title: |-
  Installing MikroTik CHR on any VPS
date: 2026-11-03T08:44:00Z
tags:
  - VPS
  - MikroTik
  - Linux
  - Virtualization
  - Networking
---
Every now and then I want a MikroTik Cloud Hosted Router (CHR) running somewhere on the internet. To test something, to learn something, or just to play with it. A cheap VPS is perfect for that. Getting CHR onto it, though, isn't always as easy as it could be.

<!-- excerpt -->

The problem is that most VPS providers don't let you upload your own disk image. Some let you upload an ISO, but that doesn't help either. The ISO is RouterOS for x86 (or ARM64), and that's not the same thing as CHR.

So I cheat a little. I boot whatever Linux the provider gives me, log in as `root`, and simply overwrite the disk with the CHR image. Quick and dirty, but it works.

```sh
cd /dev/shm
wget https://download.mikrotik.com/routeros/7.24.6/chr-7.24.6.img.zip
unzip -p chr-7.24.6.img.zip > chr.img

echo u > /proc/sysrq-trigger
dd if=chr.img of=/dev/vda bs=4M oflag=sync
echo b > /proc/sysrq-trigger
```

The trick is doing things in the right order. The image goes to `/dev/shm`, which lives in RAM, so it survives the disk being overwritten. Then all filesystems are remounted read-only (`u`), so Linux stays out of the way while `dd` writes the image over the disk. Finally, the machine reboots (`b`), straight into CHR.

Just swap in the version you want and replace `/dev/vda` with your disk.

But before you run it, make sure you have console access (KVM, VNC or similar). Unless your provider uses DHCP, you'll need it to assign IP addresses and set routes. And if it does use DHCP, be quick. The CHR is reachable from the internet right after boot, with the default `admin` user and no password, so log in and set a password right away.

Happy routing.