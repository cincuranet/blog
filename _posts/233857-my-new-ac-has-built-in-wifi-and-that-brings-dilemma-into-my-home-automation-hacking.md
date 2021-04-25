---
title: |-
  My new AC has built-in Wi-Fi and that brings dilemma into my home automation hacking
date: 2021-04-05T18:19:00Z
tags:
  - IoT
  - Home Automation
---
Last week I had AC installed into my house and the unit has Wi-Fi module as a standard option. That brings dilemma to my inner geekiness. As you might expect from me, I want to control the unit remotely my own way. Would the unit have only infrared remote control I would take some ESP8266 board (_Wemos D1 Mini Pro_ is my favorite) and hack together my own infrared remote with simple API over the Wi-Fi. Because that would be the only way. But now I have two options. Oh my.

<!-- excerpt -->

You know, I'm a software guy. I know my way around things involving software. Hence, I'm torn between going the infrared path and the Wi-Fi path.

#### Wi-Fi

After the quick initial research, it _looks like_ my unit is based on (or maybe it's just a simple white label) Gree hardware. Which is nice, because somebody already did the work and the more or less complete protocol/API description/implementation is available [here][1]. I'm wondering why the protocol/API works the way it works (i.e. UDP), but hey, I never programmed API for AC unit.

This would be my no-thinking choice would I know everything is going to work as described (maybe my unit has some custom modifications, you never know) and would I know the unit would be fine when I cut it from internet access altogether (because I'm paranoid).

#### Infrared

I don't like dealing with hardware. I just don't. There's a ton of tutorials on the interwebs around infrared. However, I need to order stuff, hopefully correct, then fiddle with resistors, check bunch of infrared implementation libraries, deal with timing, repeats and stuff. It's exhausting for me. And at the end build a simple HTTP (or MQTT or something) API, which would be piece of cake in .NET or Python, but these libraries for microcontrollers are just not compatible with how I want to write the code (Yeah, I hear you, 15 bytes extra matters.). On the bright side, once (if) everything is done (Is it ever?), it's just a matter of replicating what the original remote is doing and that's it. The unit will never know.

#### Solution (or not)

I gravitate towards trying Wi-Fi first, mostly because I'm stronger in that area. If that fails, I switch to infrared. Fingers crossed that it either fails at the very beginning or it will work flawlessly, because I know how difficult it is to decide to cut the losses and start over.

I'll share my trials and tribulations (and eventual victories). And yes, I know, I'm making these problems, would I simply use the remote from the box - like my wife is going to - I would be perfectly fine.

[1]: https://github.com/tomikaa87/gree-remote