---
title: |-
  Introducing NtpTick: A lightweight NTP client for .NET
date: 2026-03-24T12:06:00Z
tags:
  - Network
  - NTP
  - Time
---
Over the last couple of years, I've spent a lot of time studying, experimenting, and learning about clocks, NTP, PTP, and time synchronization in general. It's a fascinating area that brings together software, hardware, math, and networking - and I've thoroughly enjoyed going down this rabbit hole.

<!-- excerpt -->

As part of this journey - alongside running my public Stratum 1 NTP/NTS server at [time.cincura.net][1] - I decided to build my own NTP client implementation in C# and .NET, called [_NtpTick_][2].

The primary goal of _NtpTick_ is to better understand the [NTP protocol][3] from the inside out. A secondary goal was to explore more some of the lower-level features available in modern C#, such as _inline arrays_, _spans_ (obviously), and `System.Buffers.Binary`. Along the way, I focused on keeping the library simple, efficient, and dependency-free. The result is a lightweight NTP client with a clean and intuitive API, released under MIT license. It allows you to query NTP servers easily, while still giving you access to the raw NTP packet data if you want to dig deeper.

I'm happy to say that version 1.0 is available today [on NuGet][4]. While this feels like a solid first milestone, there's more I'd like to explore - most notably adding support for NTS (Network Time Security) in the future.

For now, _NtpTick_ is very much a product of curiosity and learning. We'll see where it goes next - but if this sounds interesting to you, give _NtpTick_ a try!

[1]: https://time.cincura.net
[2]: https://github.com/cincuranet/NtpTick/
[3]: https://en.wikipedia.org/wiki/Network_Time_Protocol
[4]: https://www.nuget.org/packages/NtpTick