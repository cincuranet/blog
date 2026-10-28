---
title: |-
  Slim kiosk setup for my kitchen dashboard on Raspberry Pi
date: 2026-10-28T12:15:00Z
tags:
  - Raspberry Pi
  - Home Automation
  - X
---
I have a Raspberry Pi Monitor on my kitchen wall, driven by a Raspberry Pi. It shows a simple webpage, fed via MQTT with data from my smart home automations: the current house power consumption, the outside temperature, the temperature in my office, my car's remaining range, and so on. That's all it does.

Recently, the SD card there died, so I had to reinstall it and took the opportunity to switch to a Raspberry Pi 3A+. And because the whole job is showing a single webpage, I wanted the setup reasonably slim: no desktop environment, just X and a browser.

<!-- excerpt -->

This post is mostly documentation for future me, but maybe it will save you some time too.

I started with Raspberry Pi OS Lite (64-bit) and installed only these packages: `xserver-xorg`, `xinit`, `chromium`, `fonts-noto-color-emoji` and `fonts-liberation2`. The last two are fonts, so the text and symbols on the webpage render correctly. I don't need Bluetooth, so I also turned it off by adding `dtoverlay=disable-bt` to `/boot/firmware/config.txt`.

Next, I set the Pi to log in automatically on the console after boot. That's an option in `raspi-config` (under System Options).

To start X right after that login, I modified `.bash_profile`:

```bash
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi

if [ -z "$DISPLAY" ] && [ "$(tty)" = /dev/tty1 ]; then
  exec startx -- -nocursor -s 0 -dpms
fi
```

The first part is the usual default. The second part runs `startx` when the Pi logs in on the first console (and not, for example, over SSH). The extra options hide the mouse cursor (`-nocursor`) and keep the screen from blanking (`-s 0` disables the screen saver, `-dpms` disables power saving).

Then I created `.xinitrc`, which tells X to run nothing but Chromium in kiosk mode, at the monitor's full 1920×1080 resolution:

```bash
#!/bin/sh

exec /usr/lib/chromium/chromium --kiosk --user-data-dir=/tmp/chromium --window-position=0,0 --window-size=1920,1080 <URL>
```

Chromium keeps its profile in `/tmp`, which lives in RAM (tmpfs). So every start is a clean one, and it isn't constantly writing to (and wearing out) the SD card.

With that done, I rebooted the Pi, waited a moment (it takes a while to start), and voilà, my screen was back, running on a fairly slim setup.