---
title: |-
  Announcing time.cincura.net - Stratum 1 NTP and NTS time server located in Czech Republic, Europe
date: 2025-07-23T12:30:00Z
tags:
  - Time
  - Network
  - NTP
  - Homelab
---
Ever since I started building my homelab and started playing with networking I wanted to give something back. Something that's a valuable service. And although I'm self-hosting a bunch of my websites and providing data from my weather stations publicly, it was not _it_. Until I stumbled upon timekeeping and time servers.

<!-- excerpt -->

The idea of my own time server lingered in the back of my mind for years as I gradually explored the topic, but it was only a few months ago that I finally decided to bring it to life.

After much experimentation and gradual progress, I'm excited to share that this journey has led me to launch a public NTP and NTS time server. To use it, point your client to `time.cincura.net`. The server is Stratum 1 and physically located in Czech Republic, Europe. For those intrigued by the technical aspects - if terms like "disciplined clock" or "oscillator" pique your interest - comprehensive and up-to-date information about the setup is available at [time.cincura.net][1]. You can get a sense of the server's performance from the statistics of NTP Pool Project - in which this server participates - [here][2] and [here][3].

The project isn't finished - far from it - but it's at a stage where it's reliable and useful, and I'm eager to keep refining it as I learn more.

[1]: https://time.cincura.net
[2]: https://www.ntppool.org/scores/2001:67c:d74:66::71be
[3]: https://www.ntppool.org/scores/85.163.168.227