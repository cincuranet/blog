---
title: |-
  Current and historical data for the time.cincura.net public time server
date: 2026-11-16T10:00:00Z
tags:
  - Time
  - Networking
  - NTP
  - Homelab
---
This has been cooking for a while now, so some of you may have already noticed it. Still, I think it deserves its own blog post, because I'm really excited about the data.

<!-- excerpt -->

Over the last week or two, I've been working on providing both current and historical data for the time.cincura.net public time server. There are two reasons. First, I want to see whether something has changed and, hopefully, correlate it with other data. Second, I want to make the data public, so anybody can check how the server is doing - and how it has been doing - before deciding to use it. I take my work on my NTP/NTS server seriously and want to be open about how it's performing.

On [`time.cincura.net`][1] you'll now find a current snapshot from Chrony: the output of `tracking`, `sources`, `sourcestats` and `authdata`, so you can quickly see how things are going. Alongside that, there's also a snapshot of a couple of UBX messages I'm collecting - `UBX-NAV-PVT`, `UBX-NAV-TIMEUTC`, `UBX-NAV-CLOCK` and `UBX-NAV-SIG` - in case you'd like to dig a little deeper.

Snapshots are interesting, but they're still just snapshots. So I'm now also providing 48 hours of historical data in charts, covering both Chrony and the GNSS receiver. I may have gone a little overboard with the amount of data, but in my defense, I'm a data hoarder, and more data is always better than less. In the charts, rendered as SVG with the help of AI, you can see historical values for *System time offset*, *RMS offset*, *Root dispersion*, *Skew* and more, plus a plethora of data about the GPS, Galileo and BeiDou constellations and the status of the GNSS receiver.

The part I enjoy looking at the most is the system time offset. For example, at the time of writing, the average over the last 48 hours is -12 ns, and 95% of the samples are within 273 ns. For an NTP server, anything below a microsecond is an excellent result. To put it into perspective, the network path between the server and a client on the internet typically adds somewhere between tens of microseconds and a few milliseconds of uncertainty, so the server itself is not going to be the weak link.

The GNSS charts are just as interesting. The receiver typically uses about 9 GPS, 8 Galileo and 6 BeiDou satellites, and it tracks two frequency bands for each constellation: L1 and L5 for GPS, E1 and E5 for Galileo, and B1 and B2 for BeiDou. In every constellation, the signals in the second band come in about 2 dB stronger (for example, 47 vs. 45 dBHz for Galileo), which makes sense, because they are transmitted with more power. The pseudorange residuals, roughly how well the measurements agree with the solution, show a clear difference too. Galileo and BeiDou, where the receiver uses both bands and can correct for the ionospheric delay, are at around 0.6 m and 0.7 m RMS. GPS is at around 1.5 m, because the receiver uses only L1 (at the time of writing, L5 is still marked as unhealthy). And thanks to OSNMA, the Galileo satellites in use are almost always all authenticated.

Behind the scenes, there's nothing fancy. A Python script runs every five minutes, collects the data, parses it and stores it in a SQLite database (sorry Firebird, SQLite is enough here). Because everything is stored, 48 hours is just an arbitrary number. I'm not sure I'll ever need all of that data, but you know - data hoarder.

If you've ever looked at the [`time.cincura.net`][1] page and weren't sure whether the server is worth using, I hope this data helps you decide. By the way, the *NTP Pool Project* also monitors my server ([IPv4][2] and [IPv6][3]), in case you'd like to cross-check it against independent data.

[1]: https://time.cincura.net
[2]: https://www.ntppool.org/scores/85.163.168.227
[3]: https://www.ntppool.org/scores/2001:67c:d74:71be::c10c