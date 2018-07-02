---
title: |-
  Two little nuggets about NOP instruction
date: 2018-07-02T06:00:00Z
tags:
  - Assembly
---
I'm researching some spin locks stuff last few days. That led to checking also `NOP` instruction and I've found two interesting little nuggets.

<!-- excerpt -->

#### #1

If you look at the _opcode_ for `NOP`, you'll find it's `0x90`. So far so good. But `XCHG EAX, EAX` is `0x90` as well on Intel x86. Interesting! `XCHG EAX, EAX` is doing "nothing", so, I think architects just reused it. Certainly, I'm not the first one to realize this, it's described in the documentation (i.e. [here][1]), but who reads it, right?

#### #2

All the above is on Intel x86. On x64 (AMD64) if the `NOP` would be `XCHG EAX, EAX`, the upper 32 bits of RAX would be cleared (because of how the 64-bit extension of x86 works) on `NOP`. Not good. Thus on x64 the `XCHG EAX, EAX` was changed to be `0x87, 0xC0` ([more info][2]).

[1]: https://c9x.me/x86/html/file_module_x86_id_217.html
[2]: https://www.pagetable.com/?p=6