---
title: time.cincura.net time server
layout: page
---
### time.cincura.net time server

`time.cincura.net` is a public **Stratum 1** time server available for anyone to use. It supports NTP and NTS. Time is sourced from GNSS (GPS + Galileo + BeiDou) with PPS. The server is physically located in the Czech Republic, Europe.

My goal with this server is to achieve the best possible accuracy (within a reasonable budget) and learn something along the way. I'm committed to running it "forever".

It's also part of the [NTP Pool Project][6], with public status pages for [IPv4][3] and [IPv6][4].

#### On this page

* [Statistics][Statistics]
* [Snapshot][Snapshot]
* [Technical info][Technical info]
* [Bonus][Bonus]
* [Blog posts][Blog posts]

#### Statistics

Last 48 hours at 5-minute resolution, updated <span id="statistics-last-updated"><span class="fa-regular fa-clock fa-spin-pulse" aria-label="Loading"></span></span> UTC.

<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_offset.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_root.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_frequency.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_skew.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_status.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_satellites.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_prres.svg"></object>
<object type="image/svg+xml" data="https://time.cincura.net/api/time_history_cno.svg"></object>

#### Snapshot

Current state of Chrony and the GNSS receiver, captured <span id="snapshot-last-updated"><span class="fa-regular fa-clock fa-spin-pulse" aria-label="Loading"></span></span> UTC.

##### Chrony

* <a href="#" data-expand="chronyc-tracking-data">`chronyc tracking`</a>

<div id="chronyc-tracking-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="chronyc-sources-data">`chronyc sources`</a>

<div id="chronyc-sources-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="chronyc-sourcestats-data">`chronyc sourcestats`</a>

<div id="chronyc-sourcestats-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="chronyc-authdata-data">`chronyc authdata`</a>

<div id="chronyc-authdata-data" class="hidden">

```text
```

</div>

##### UBX

* <a href="#" data-expand="ubx-nav-pvt-data">`UBX-NAV-PVT`</a>

<div id="ubx-nav-pvt-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="ubx-nav-timeutc-data">`UBX-NAV-TIMEUTC`</a>

<div id="ubx-nav-timeutc-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="ubx-nav-clock-data">`UBX-NAV-CLOCK`</a>

<div id="ubx-nav-clock-data" class="hidden">

```text
```

</div>

* <a href="#" data-expand="ubx-nav-sig-data">`UBX-NAV-SIG`</a>

<div id="ubx-nav-sig-data" class="hidden">

```text
```

</div>

<script type="module">
	const problem = 'n/a';
	const data = await blog.fetchData('https://time.cincura.net/api/time_history_stats.json');

	document.getElementById('snapshot-last-updated').textContent = data?.generated ?? problem;
	document.getElementById('statistics-last-updated').textContent = data?.generated ?? problem;

	document.querySelector('#chronyc-tracking-data pre code').textContent = data?.chrony?.tracking ?? problem;
	document.querySelector('#chronyc-sources-data pre code').textContent = data?.chrony?.sources ?? problem;
	document.querySelector('#chronyc-sourcestats-data pre code').textContent = data?.chrony?.sourcestats ?? problem;
	document.querySelector('#chronyc-authdata-data pre code').textContent = data?.chrony?.authdata ?? problem;

	document.querySelector('#ubx-nav-pvt-data pre code').textContent = data?.ubx?.['NAV-PVT'] ?? problem;
	document.querySelector('#ubx-nav-timeutc-data pre code').textContent = data?.ubx?.['NAV-TIMEUTC'] ?? problem;
	document.querySelector('#ubx-nav-clock-data pre code').textContent = data?.ubx?.['NAV-CLOCK'] ?? problem;
	document.querySelector('#ubx-nav-sig-data pre code').textContent = data?.ubx?.['NAV-SIG'] ?? problem;
</script>

#### Technical info

> This isn't meant to be a comprehensive guide. I do not consider myself an expert - just someone who did a bunch of experimentation and research.

##### Sources

The server tracks multiple constellations simultaneously: GPS from L1 and L5 signal; Galileo from E1 and E5a signal, with OSNMA; BeiDou from B1C and B2a signal.

QZSS and NavIC are not used, as they're regional systems with no useful coverage in central Europe.

##### Module and antenna

The setup uses [u-blox NEO-F10T][1] together with a [u-blox ANN-MB1][2] antenna. The NEO-F10T supports nanosecond-level accuracy and includes a TCXO.

The antenna is mounted ~50 cm above the roof with a full 360° view of the sky. A 10 m MRC-240 extension connects the antenna to the module. A ~20 cm brass ground plane is used.

##### Configuration

* The NEO-F10T is connected using UART (57600/8/1/n) directly to Raspberry Pi Compute Module 4 with 2 GB RAM.
* All CPUs are pinned to 1.5 GHz (`force_turbo` boot config/`performance` scaling governor).
* PPS is connected to a GPIO 18 pin.
* Antenna delay is set to 70 ns:
    * ANN-MB1 has 5 m RG-174 (VF 0.66) → ~25.3 ns.
    * Extension is 10 m MRC-240 (VF 0.84) → ~41.7 ns.
    * Added 3 ns for active antenna characteristics.
* PPS is 1 Hz, rising edge, 10000 µs pulse (4 mA), with 0 user delay.
* The module is in *timing* mode, with fixed (stationary) position.
    * The position was determined using Survey-In with < 50 cm accuracy (1 m ≈ 3.3 ns).
* Chrony handles clock disciplining, NTP and NTS.
* `gpsd` handles communication with the module.
* OS is Raspberry Pi OS Lite 64-bit.
* SBAS is enabled.
* Galileo OSNMA is enabled (without trusted time enforcement).
* `UBX-NAV-SIG`, `UBX-NAV-PVT`, `UBX-NAV-TIMEUTC` and `UBX-NAV-CLOCK` are enabled.

#### Bonus

Yes, the IPv6 address has `71be` and `c10c` in it - a totally intentional (and slightly tortured) attempt to spell *time* and *clock* in hex. Squint hard enough, believe in magic, and it's there.

#### Blog posts

* [{{ include "post_title" 233951 }}][blog1]
* [{{ include "post_title" 233969 }}][blog2]
* [{{ include "post_title" 233983 }}][blog3]

<!--
<div data-tabs>
	<a href="#" data-tab="tab-a" class="active">a</a>
	<a href="#" data-tab="tab-b">b</a>
	<div id="tab-a">
		aaa
	</div>
	<div id="tab-b" class="hidden">
		bbb
	</div>
</div>
-->

[1]: https://www.u-blox.com/en/product/neo-f10t-module
[2]: https://www.u-blox.com/en/product/ann-mb1-antenna
[3]: https://www.ntppool.org/scores/85.163.168.227
[4]: https://www.ntppool.org/scores/2001:67c:d74:71be::c10c
[6]: https://www.ntppool.org/
[blog1]: {{ include "post_link" 233951 }}
[blog2]: {{ include "post_link" 233969 }}
[blog3]: {{ include "post_link" 233983 }}