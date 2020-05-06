---
title: |-
  Calibrating Aeotec Multisensor 6's temperature using OpenZWave (in Domoticz)
date: 2017-11-06T19:29:00Z
tags:
  - OpenZWave
  - Domoticz
  - Z-Wave
---
The [Multisensor 6 from Aeotec][2] is a nice little device. I have three of these in my house at the moment (and I'm sure I'm not done yet ;)). Being data geek I always calibrate the temperature (and humidity) sensor to match my own "calibration" devices ([ESP-8266][6] with [Si-7021][5]). The steps described in [official documentation][1] are correct, but because I use [OpenZWave][4] (in [Domoticz][3]) I had to do some specific steps to make it work.

<!-- excerpt -->

It's mostly related to negative values, because that's where the values fall appart. Let's take the example from documentation. Setting the offset to -2,5 °C. That's `256 - 25`. `231` in dec or `E7` in hex. Thus, the final value is `0xE701` (for °C). This is `59137` in dec. Sadly, typing this as a configuration value was not working for me (with the current version of Domoticz). I had to put `‭-6399‬`. That's the same value, but converted to `short` (compared to `ushort`). You can get the value simply by subtracting `65536` from the value you computed (i.e. `59137`). Also you can switch the calculator in Windows, in _Programmer_ mode, to `WORD` size and you'll get the same value in `DEC` row.

![WORD value in calculator]({{ include "post_ilink" page "calc.png" }})

More examples (all for °C): 

* `-0.6` → `-1535`
* `-0.5` → `-1279`
* `-0.3` → `-767`

It took me a while to understand what's going on, luckily OpenZWave is open-source, and adjust my values accordingly. Hope it saves you some time.

<small>Note: Yes I know I can calibrate the temperature directly in Domoticz. I just like it done on device.</small>

[1]: https://aeotec.freshdesk.com/support/solutions/articles/6000120736-calibrating-offsetting-temperature-on-multisensor-6-excel-easy-sheet-included
[2]: https://aeotec.com/z-wave-sensor
[3]: http://www.domoticz.com/
[4]: https://github.com/OpenZWave
[5]: https://www.silabs.com/documents/public/data-sheets/Si7021-A20.pdf
[6]: http://espressif.com/en/products/hardware/esp8266ex/overview