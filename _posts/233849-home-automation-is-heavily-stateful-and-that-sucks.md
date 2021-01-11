---
title: |-
  Home automation is heavily stateful and that sucks
date: 2021-01-11T08:42:00Z
tags:
  - IoT
  - Home Automation
  - Z-Wave
  - Zigbee 
---
In programming we like stateless pieces of code, immutable data structures, functional composition, etc. and we value languages, libraries and environments designed with this in mind. Home automation is complete opposite.

<!-- excerpt -->

I should start by clarifying the "home automation". I don't mean IoT. Or Z-Wave, Zigbee, etc. devices themselves. I mean the scenes/events/automations/... you can write and execute on your hub/controller/... I'm fine with IoT being heavily stateful. If you have 1kB of memory, it's not a best idea to start doing crazy stuff with immutable data structures.

All the hubs/controllers/... I've ever seen are more or less focused on imperatively manipulating the state. I, as a developer, can make my way through it. But I'm pretty sure, that for average guy or girl out there this eventually becomes too complex and he or she will not know how to handle the growing "statefullness".

Let me give you small example. I recently needed to block my heating while the window in the room is open and continue doing so also 5 minutes after it was closed. Seems simple and straightforward. But once you dig deeper it's complete opposite. Let's start with simple solution. When the "window open" event happens, set the thermostat to "off" and when the "window close" event happens wait 5 minutes and put the thermostat back to "heat" mode. This is obviously going to fail if the thermostat was originally in "off" mode (for whatever reason), because now it would become switched to "heat" mode. Alright. I'll save the original mode in "window open" event and use it later in "window close". That kind of works. But you're now managing some state - the original mode. But what about opening the window again within the 5-minute period. The mode is still "off", but you can't save that as original mode, you need to retain the "original" original mode. Also, the previous 5-minute delay should be cancelled. What if the user changes the thermostat mode while the window is open? Should the setting be immediate? Or should it be delayed after the window is closed and 5-minute wait is over? Or... And this is only few "problems" that popped in my head as I was writing the initially simple looking piece of code, but there's likely more.

Now you're probably waiting for some cool solution or advice, right? I don't have any. At the end I went with the simple hardcoded "off" and "heat" modes (with the 5-minute delay cancellation when the window is opened again), mostly because heating in my house is fully automated and nobody is touching it and also because when I turn off the heating in spring (and hence switching the thermostat back to "heat" would be incorrect) I will turn off (hopefully) this code as well.

What I want to say is, that maybe we're at a point, where the hubs/controllers/... manufacturers need to only focus not on user friendliness, mobile apps, etc., but also on a framework they're offering for "programming". Or maybe I'm looking at it via too technical glasses and this "complexity" does not really bother regular users and I'm overthinking it.