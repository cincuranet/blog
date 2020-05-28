---
title: |-
  Disassembling a relay
date: 2017-04-02T16:41:00Z
tags:
  - IoT
  - Electronics
---
I like taking things apart. Or putting them together. New piece of furniture from IKEA is like a small Christmas. It's something different than programming, yet very similar, at least for me, in how the brain processes the (dis)assembling. Already as a child in school I liked learning how everyday objects work.

<!-- excerpt -->

But there's a small difference in understanding the concept and really seeing the real - production level quality design - device. Because for production level quality you need to work out all the corner cases here and there, understand i.e. real forces applied and so on.

So when I realized my 4 dollar relay is broken I decided to take it apart (irreversibly ;)), to see how the real relay looks inside. The idea is simple. You have some spring keeping the two contacts from touching and a coil that eventually pulls them together, if there's juice flowing through it.

Here are some picture (excuse my sloppy soldering job):

[![Relay - front]({{ include "post_ilink" page "relay01_thumb.jpg" }})]({{ include "post_ilink" page "relay01.jpg" }})

[![Relay - side]({{ include "post_ilink" page "relay02_thumb.jpg" }})]({{ include "post_ilink" page "relay02.jpg" }})

[![Relay - side-front]({{ include "post_ilink" page "relay03_thumb.jpg" }})]({{ include "post_ilink" page "relay03.jpg" }})

To my surprise even the real life "implementation" of relay (alright, this is a cheap 4 dollar relay, not rated for high current, precise switching times, etc.) is pretty much the same as the basic concept. There's a coil, some contacts and one of them is on a preloaded piece of metal acting as a spring.

Can't be any simpler. How cool is that?