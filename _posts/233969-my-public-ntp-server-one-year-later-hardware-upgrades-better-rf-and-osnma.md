---
title: |-
  My public NTP Server, one year later: Hardware upgrades, better RF, and OSNMA
date: 2026-04-27T06:21:00Z
tags:
  - Time
  - Network
  - NTP
  - Homelab
---
It's been almost a year since I put my NTP server on the public internet. Since then I've changed a few things, so I'm due for a write-up.

<!-- excerpt -->

#### Raspberry Pi Compute Module 4

Originally, the server ran on a Raspberry Pi 4 Model B, and it was perfectly fine. However, it uses the Broadcom BCM54213PE as its Ethernet PHY, which doesn't support [IEEE 1588 Precision Time Protocol (PTP)][5] hardware timestamping. While that doesn't affect NTP directly, I'm a bit of a time geek (Could you tell?) and wanted to experiment with PTP without relying on software timestamping.

The Raspberry Pi Compute Module 4, on the other hand, uses the Broadcom BCM54210PE, which _does_ support IEEE 1588 PTP hardware timestamping (I have some fun PTP projects lined up - stay tuned if you're interested.). I paired it with the [Waveshare Compute Module 4 PoE Board][1]. It exposes `SYNC_IN` - which is what matters for me (or so I thought). It also supports a wider range of input voltages, and I already have a solid 24 V power supply in my server room (mostly for Mikrotik devices). PoE and the four USB 3.0 ports are just nice-to-haves in case I repurpose it for something else later.

A small note about `SYNC_IN`: I spent quite some time trying to make PTP hardware timestamping work with my PPS input, and no matter what I tried, I couldn't get it to work. As it turns out, [`SYNC_OUT` is used for both input and output][2]. I should have googled a bit more after the first failure.

#### New Chrony and Raspbian

With the new hardware, I also decided to update (reinstall, actually) to a newer Raspberry Pi OS based on Debian 13 (Trixie). That bumped Chrony to 4.6.1 (at the time of writing).

#### Ground plane

When I originally mounted the ANN-MB1 antenna, I didn't add any ground plane. It performed fine, but since I knew close to nothing about ground planes, I wanted to read up first. In the end, I hand-cut a 20 cm diameter disc from a sheet of bronze, drilled two holes for screws, and slid it between the antenna and my 3D-printed T-shaped mount. While I was up there, I also took the opportunity to inspect the antenna after a summer of heat and a winter of snow - so far, so good.

I'm not sure how to quantify the improvement objectively. Right now the module reports 20-25 satellites in use; before it was more like 14-18. To be fair, I also updated the firmware on my NEO-F10T in the meantime (more on that below), so that might have contributed as well. Either way, the number isn't going down - looks good to me.

#### Firmware 3.02 and OSNMA

I was looking forward to setting up OSNMA - I knew it would give me something new to learn. Since firmware 3.02 isn't publicly available, I had to open a couple of support tickets with u-blox, sign an NDA, and only then did they share the firmware with me. Not a difficult process, but surprisingly slow. Updating the firmware itself is straightforward, but be warned: 3.02 drops GLONASS support, and the update also wipes the configuration.

Configuring OSNMA is easy with u-center 2. It includes an OSNMA configuration wizard that lets you setup the Merkle tree root and public key. You can download these files from the [European GNSS Service Centre][3]. You do need to register first, though, and I found the authenticated part of the site a bit confusing.

To be fully compliant with OSNMA, you need a trusted external time source and must provide it via `UBX-MGA-INI-TIME_UTC` or `UBX-MGA-INI-TIME_GNSS`. For a timing server, that's a bit of a chicken-and-egg problem. My Waveshare board has an RTC and, aside from occasional reboots for configuration changes, it runs 24×7. So I could set the hardware clock based on the current time and use it at startup. During a reboot, the RTC will not drift by more than 15 seconds, which means the "better" MAC ADKD type 0 could still be usable.

For now, I've relaxed this requirement using the `UBX-GAL-TIMESYNC` configuration option, and I'll revisit it later. The server runs 24×7 anyway and uses time from multiple constellations. That keeps the practical attack window small, and it's a risk I'm willing to accept for the moment.

For full context, here's the description of `UBX-GAL-TIMESYNC`:
> Apply the time synchronization requirement -- The security of OSNMA protocol against delayed attacks depends on the fulfilment by the receiver of the time synchronization requirement described in Annex C of OSNMA Receiver Guidelines (Issue 1.3, January 2024). The time synchronization requirement establishes that, to apply OSNMA protocol, the receiver must know an estimation of the Galileo System Time and its uncertainty from an independent and trusted source. This configuration key allows to activate OSNMA protocol execution even if no external time is provided, as it will still provide protection against certain spoofing attacks. If this configuration key is set to true, external time must be provided through 'UBX-MGA-INI-TIME_UTC' or 'UBX-MGA-INI-TIME_GNSS', indicating in the corresponding field that the time reported comes from a trusted source. Otherwise, OSNMA protocol will not be applied. The accuracy of the time provided in 'UBX-MGA-INI-TIME_UTC' or 'UBX-MGA-INI-TIME_GNSS' must be better than 15 seconds to use MAC ADKD type 0 and better than 165 s to use MAC ADKD type 12. When the time accuracy degrades beyond 165 seconds, the OSNMA protocol cannot be applied. If this configuration key is set to false, OSNMA protocol is applied without an external time input. Note that this configuration is not compliant with OSNMA SIS ICD (Issue 1.1, October 2023), which indicates that external time must be provided to execute OSNMA.

#### Statistics

I'm also adding more runtime data to the [time.cincura.net website][4], so anyone can transparently check how the server is doing. For now it's mostly Chrony stats, but I plan to add data from selected UBX messages and some network statistics too.

#### Summary

I'm continuing to enjoy this project a lot. It keeps giving me learning opportunities, challenges me, and feels rewarding at every step. You don't have to go all-in to get reasonable results - but I take pride in not cutting corners.

At this point the server handles ~1.6k packets per second on average and has a stable score of 20.0 in [NTP Pool Project monitoring][6]. In normal operation, Chrony keeps the system clock tightly disciplined - exactly what you want from a reliable time source.

[1]: https://www.waveshare.com/wiki/Compute_Module_4_PoE_Board
[2]: https://github.com/jclark/rpi-cm4-ptp-guide/blob/main/computer.md
[3]: https://www.gsc-europa.eu/
[4]: https://time.cincura.net/
[5]: https://en.wikipedia.org/wiki/Precision_Time_Protocol
[6]: https://www.ntppool.org/scores/2001:67c:d74:66::71be