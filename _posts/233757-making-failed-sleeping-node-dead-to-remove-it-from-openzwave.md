---
title: |-
  Making failed sleeping node dead to remove it from OpenZWave
date: 2018-12-02T14:33:00Z
tags:
  - OpenZWave
  - Z-Wave
  - Domoticz
---
Yesterday I found out that one of my [NodOn Soft Remote][1]s was dead as a doornail, maybe even deader than a doornail. That was problem. Because the Z-Wave controller has no way detecting this node is dead, because it's a sleeping node. How to get out of this situation? 

<!-- excerpt -->

With bit of hacking, obviously. Although having sleeping dead node in the network isn't probably as problematic as having dead beaming node, it still sucks (using ID at least).

The steps I did are bit fuzzy, because I had to repeat some steps to make OpenZWave cooperate, but it worked at the end. Here's what _I_ did, your mileage may vary...

I'm using [OpenZWave][2] with [Domoticz][3] and [Aeotec Z-Stick][4] as a controller. Also, backup is always a good idea.

* Stop any OpenZWave (or rather application using OZW) instance. In the `zwcfg_xxx.xml` file locate the dead node (i.e. by ID) and remove the whole `CommandClass` for `COMMAND_CLASS_WAKE_UP`. Restart the application.
* Wait for full network initialization. The node should be marked as dead now. In OpenZWave control panel execute the _Remove Failed Node_ command. Either this removes the node more or less immediately or not (waiting couple of minutes didn't seem to do anything for me). 
* If not, stop the application, re-check the `zwcfg_xxx.xml` file and reboot the machine (maybe removing and pluging the controller/Z-Stick back in is enough, for me reboot was easier). Repeat previous step.

With steps above I was able to "fix" two nodes (while trying to exclude the NodOn Soft Remote different node got somewhat excluded and it popped up after reboot, but I already re-included (with new ID) :S) in the Z-Wave network.

[1]: https://nodon.fr/en/nodon/the-z-wave-soft-remote/
[2]: https://github.com/OpenZWave/open-zwave/
[3]: http://domoticz.com/
[4]: https://aeotec.com/z-wave-usb-stick