---
title: time.cincura.net time server
layout: page
---
### time.cincura.net time server

`time.cincura.net` is a public **Stratum 1** time server available for anyone to use. It supports NTP and NTS. Time is sourced from GNSS (GPS + Galileo + BeiDou) with PPS. The server is physically located in the Czech Republic, Europe.

My goal with this server is to achieve the best possible accuracy (within reasonable budget) and learn something along the way. I'm committed to running it "forever".

It's also part of the [NTP Pool project][5], with public status pages for [IPv4][3] and [IPv6][4].

#### On this page

* [Runtime info][Runtime info]
* [Technical info][Technical info]
* [Bonus][Bonus]
* [Blog posts][Blog posts]

#### Runtime info

Below is a snapshot of runtime data. The data was last generated at <code id="last-generated">Loading...</code>.

##### Chrony

* <a href="#" data-expand="chronyc-tracking-data">`chronyc tracking`</a>

<div id="chronyc-tracking-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="chronyc-sources-data">`chronyc sources`</a>

<div id="chronyc-sources-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="chronyc-sourcestats-data">`chronyc sourcestats`</a>

<div id="chronyc-sourcestats-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="chronyc-serverstats-data">`chronyc serverstats`</a>

<div id="chronyc-serverstats-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="chronyc-authdata-data">`chronyc authdata`</a>

<div id="chronyc-authdata-data">

```text
Loading...
```

</div>

##### NEO-F10T

* <a href="#" data-expand="ubx-nav-pvt-data">`UBX-NAV-PVT`</a>

<div id="ubx-nav-pvt-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="ubx-nav-timeutc-data">`UBX-NAV-TIMEUTC`</a>

<div id="ubx-nav-timeutc-data">

```text
Loading...
```

</div>

* <a href="#" data-expand="ubx-nav-sig-data">`UBX-NAV-SIG`</a>

<div id="ubx-nav-sig-data">

```text
Loading...
```

</div>

<script type="module">
	const problem = 'Problem while loading.';
	const data = await blog.fetchData('https://time.cincura.net/api/stats.json');

	document.getElementById('last-generated').textContent = data?.generated ?? problem;

	document.querySelector('#chronyc-tracking-data pre code').textContent = data?.chrony?.tracking ?? problem;
	document.querySelector('#chronyc-sources-data pre code').textContent = data?.chrony?.sources ?? problem;
	document.querySelector('#chronyc-sourcestats-data pre code').textContent = data?.chrony?.sourcestats ?? problem;
	document.querySelector('#chronyc-serverstats-data pre code').textContent = data?.chrony?.serverstats ?? problem;
	document.querySelector('#chronyc-authdata-data pre code').textContent = data?.chrony?.authdata ?? problem;

	document.querySelector('#ubx-nav-pvt-data pre code').textContent = data?.ubx?.['NAV-PVT'] ?? problem;
	document.querySelector('#ubx-nav-timeutc-data pre code').textContent = data?.ubx?.['NAV-TIMEUTC'] ?? problem;
	document.querySelector('#ubx-nav-sig-data pre code').textContent = data?.ubx?.['NAV-SIG'] ?? problem;
</script>

#### Technical info

> This isn't meant to be a comprehensive guide. I do not consider myself an expert - just someone who did a bunch of experimentation and research.

##### Sources

Time server uses multiple sources simultaneously. GPS is used from L1 and L5 signal. Galileo is used from E1 and E5 signal; OSNMA is enabled. BeiDou is used from B1 and B2 signal.

QZSS and NAVIC are not used due to poor coverage in Europe (Czech Republic).

##### Module and antenna

The setup uses [u-blox NEO-F10T][1] together with a [u-blox ANN-MB1][2] antenna. The NEO-F10T supports nanosecond-level accuracy and includes TCXO.

The antenna is mounted ~50 cm above the roof with a full 360° view of the sky. A 10 m MRC-240 extension connects the antenna to the module. ~20 cm brass ground plane is used.

##### Configuration

* The NEO-F10T is connected using UART (115200/8/1/n) directly to Raspberry Pi Compute Module 4 with 2 GB RAM.
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
* Galileo OSNMA is enabled (without trusted time enforcement).
* `UBX-NAV-SIG`, `UBX-NAV-PVT` and `UBX-NAV-TIMEUTC` are enabled.

#### Bonus

Yes, the IPv6 address ends in `::71be` — a totally intentional (and slightly tortured) attempt to spell "time" in hex. Squint hard enough, believe in magic, and it's there.

#### Blog posts

* [{{ include "post_title" 233951 }}][blog1]
* [{{ include "post_title" 233969 }}][blog2]

[1]: https://www.u-blox.com/en/product/neo-f10t-module
[2]: https://www.u-blox.com/en/product/ann-mb1-antenna
[3]: https://www.ntppool.org/scores/85.163.168.227
[4]: https://www.ntppool.org/scores/2001:67c:d74:66::71be
[5]: https://www.ntppool.org/
[blog1]: {{ include "post_link" 233951 }}
[blog2]: {{ include "post_link" 233969 }}