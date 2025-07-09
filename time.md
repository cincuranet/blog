---
title: time.cincura.net time server
layout: page
---
### time.cincura.net time server

`time.cincura.net` is a public **Stratum 1** time server available for anyone to use. It supports NTP and NTS. Time is sourced from GNSS (GPS + Galileo + BeiDou) with PPS. The server is physicaly located in the Czech Republic, Europe.

My goal with this server is to achieve the best possible accuracy (within reasonable budget) and learn something along the way. I'm committed to running it "forever".

It's also part of the [NTP Pool project][5], with public status pages for [IPv4][3] and [IPv6][4].

#### Technical info

> This isn't meant to be comprehensive guide. I do not consider myself an expert - just someone who did a bunch of experimentation and research.

##### Sources

Time server uses multiple sources simultaneously. GPS is used from L1 C/A and L5 signal. Galileo is used from E1-B/C and E5a signal. BeiDou is used from B1C and B2a signal.

QZSS and NAVIC are not used due to poor coverage in Europe (Czech Republic).

GLONASS is excluded, as it doesn't add much benefit for timing beyond GPS, Galileo and BeiDou.

Typically, around 14-18 satellites are in use.

##### Module and antenna

The setup uses [u-blox NEO-F10T][1] together with a [u-blox ANN-MB1][2] antenna. The NEO-F10T supports nanosecond-level accuracy and includes TCXO.

The antenna is mounted ~50 cm above the roof with a full 360° view of the sky. A 10 m MRC-240 extension connects the antenna to the module. No extra ground plane is used (yet).

##### Configuration

* The NEO-F10T is connected using UART (115200/8/1/n) directly to Raspberry Pi 4 Model B with 2 GB RAM.
* PPS is connected to GPIO pin.
* Antenna delay is set to 70 ns:
    * ANN-MB1 has 5 m RG-174 (VF 0.66) → ~25.3 ns.
    * Extension is 10 m MRC-240 (VF 0.84) → ~41.7 ns.
    * Added 3 ns for active antenna characteristics.
* PPS is 1 Hz, rising edge, 10000 µs pulse (4 mA), with 0 user delay.
* The module is in _timing_ mode, with fixed (stationary) position.
    * The position was determined using Survey-In with < 50 cm accuracy (1 m ≈ 3.3 ns).
* Chrony handles clock disciplining, NTP and NTS.
* GPSd handles communication with the module.
* OS is Raspberry Pi OS Lite 64-bit.
* SBAS is enabled (though mostly irrelevant for fixed-position timing).
* Galileo OSNMA is not used (yet).

#### Bonus

Yes, the IPv6 address ends in `::71be` — a totally intentional (and slightly tortured) attempt to spell "time" in hex. Squint hard enough, believe in magic, and it's there.

[1]: https://www.u-blox.com/en/product/neo-f10t-module
[2]: https://www.u-blox.com/en/product/ann-mb1-antenna
[3]: https://www.ntppool.org/scores/85.163.168.227
[4]: https://www.ntppool.org/scores/2001:67c:d74:66::71be
[5]: https://www.ntppool.org/