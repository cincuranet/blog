---
title: |-
  Using Fibaro Wall Plug to monitor water pump and pressure tank in my house
date: 2020-02-12T18:57:00Z
tags:
  - IoT
  - Domoticz
  - Z-Wave
---
Primary source of water in my house is a water well. That means I have a pump down there and a pressure tank in the house. And I like to keep an eye on both of these. With a little bit of ingenuity and the Fibaro Wall Plug I have a simple DIY solution.

<!-- excerpt -->

The first thing I monitor is how often the pump turns on and off. If it's too often it might mean that the counter pressure in the tank has dropped and I should pump some air in (which I usually do about twice a year). Or maybe the diaphragm is ruptured.

The other thing I monitor is how long the pump runs. If it's running too long, it might mean it can't build the pressure either because of failed pipe somewhere or the pump getting broken.

Finally, I can check whether the pump runs or rather does not run when nobody is at home. Because that would mean I have a leak somewhere.

I'm doing all this (and one extra, see below) with a simple script (the actual implementation depends on your home controller software) and Fibaro Wall Plug. The script simply waits for an update from the plug on the active power (_W_) and if it's above 0 it flips virtual switch on. Given my pump eats around 1500 watts when running, this is pretty easy for the plug to notice. Once the value drops back to 0, I turn off the switch. The history of the switch gives me insights into all of the information I outlined above.

At the moment I check the history from time to time manually, but one can make it even smarter - i.e. if the pump is running too long, turn off the plug (and hence the water pump) to prevent more damage either to the pump or something where the water might be leaking.

As a bonus, the plug gives me the energy consumed (_kWh_) and I can, more or less, check how much water I'm using. I don't get liters (and I don't think it can be inferred reliably), but I can still compare day to day or month to month usage.