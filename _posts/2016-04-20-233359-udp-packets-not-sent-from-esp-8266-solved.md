---
title: "UDP packets not sent from ESP-8266 - solved"
date: 2016-04-20T11:38:00Z
tags:
  - C#
  - .NET
  - Network
  - IoT
  - ESP-8266
  - Arduino
redirect_from: /id/233559/
category: none
layout: post
---
I'm now playing with ESP-8266, [Wemos D1 mini][1] to be precise. One think I'm now using for fun/debugging/communication is broadcasting UDP packets. For some reason the packets were not coming lately.

You might say: "Jiri, it's UDP. Packets will get lost.". True. But my packets were lost in 99% cases, on my home network. Something is going on.

<!-- excerpt -->

My code was pretty simple.

```cpp
WiFiUDP client;
client.beginPacket(...);
client.write(...);
client.endPacket();
```

I was playing with different IP addresses - unicast, broadcast. Nothing was working. As I was digging deeper I faced few times WDT reset. Good night sleep and I was able to connect the dots. I changed my code to use `ESP.deepSleep` (as I was prototyping more real world scenario) from `delay` one day ago. And this call was right after returning from the sending method (the one above). Could it be, that the board didn't had time to finish everything before going to sleep?

So I modified the code slightly (I tried calling `yield` blindly first before going safely to `delay` - I'm still learning, although this seemed like a reasonable function to have ;)).

```cpp
WiFiUDP client;
client.beginPacket(...);
client.write(...);
client.endPacket();
yield();
```

With this change the code now works like a charm. I don't understand the real reason deep behind, but that's the beauty of learning. Also now thinking about it. I'm not sure it should be _logically_ after sending the packet of before entering deep sleep. Let me know if you understand it.

[1]: http://www.wemos.cc/Products/d1_mini.html