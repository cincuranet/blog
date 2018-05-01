---
title: |-
  Getting the state of load management switch on budget
date: 2018-04-26T19:00:00Z
tags:
  - IoT
  - Domoticz
  - Z-Wave
---
My house has a [load management][3] switch (we call it HDO here), which means the company managing the electricity grid can turn on and off some devices, like water heater, when the demand is low or high. And in exchange I get cheaper electricity (when switched on). And although the schedule is known in advance, I was interested whether the switching happens also at unscheduled times (aka to get a little peek into what's happening in the grid) and maybe also switch automatically other devices I have when the electricity is cheap. I could ask an electrician to install another contactor on my fuse board and connect "something" to it, but I was not into doing anything permanent and expensive, in case I'd change my mind about all of this in the future etc. I also wanted to get this information into my home automation system ([Domoticz][2]). Here's my cheap solution I hacked together.

<!-- excerpt -->

Because some wall sockets in the house are switched by the load management switch I knew I can plug something into this socket and I have the "data". The problem is, when the socket goes off, the device will go off as well. I needed at least few seconds of battery backup to be able to send the change in state.

First I bought a flood sensor ([Hank Flood Sensor][4]). It is battery powered and has two contacts that, when connected - usually by water, report the status. Now it was just a question of connecting these contacts together when the wall socket is on. Obviously, I can't put 230V onto the sensor contacts. So I bought a [5V relay on a board with optocoupler][1] and used an 5V power supply (regular phone charger) to switch on the relay. The 5V switches the relay directly, no GPIO, etc. And subsequently the relay switches flood sensor's contacts (I cut out the probe and used the wires directly).

Then I used an electrical box I had lying around and placed it inside. It looks like this (the box has normally lid on).

![Relay and flood sensor in the electrical box]({% include post_ilink, post: page, name: "box.jpg" %})

The flood sensor is a simple switch in Domoticz, thus I have a nice graph with history, I can send notifications, etc.

![Graph in Domoticz]({% include post_ilink, post: page, name: "graph.png" %})

Now I can program scenarios to turn devices on and off based on this switch and I can, hopefully, understand a little what's happening in the grid around my house. 8-)

[1]: https://www.ebay.com/sch/sis.html?_nkw=5V+10A+one+1+Channel+Relay+Module+With+optocoupler+For+PIC+AVR+DSP+ARM++Arduino&_id=310636242802&&_trksid=p2057872.m2749.l2658
[2]: http://www.domoticz.com
[3]: https://en.wikipedia.org/wiki/Load_management
[4]: https://smarterhome.sk/en/flood-sensors/hank-flood-sensor-442.html