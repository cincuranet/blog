---
title: |-
  Run To Cursor in Call Stack window
date: 2017-09-07T08:32:00Z
tags:
  - Visual Studio
---
Today I found a great new feature for debugging in Visual Studio. Maybe you know the _Run to Cursor_ feature (if not, I'll explain it in next paragraph), but did you know you can use the same feature from _Call Stack_ as well?

<!-- excerpt -->

The _Run to Cursor_ feature (shortcut `Ctrl-F10`) is my favorite feature. It allows you to place cursor on some line and run to that line. Something like a temporary breakpoint. I use it very often. And in Visual Studio 2017 this works also for _Call Stack_ window.

As you're debugging, very likely you're stepping into some functions (`F11`) and going deeper and deeper. Once you nailed it or fixed it, you might want to jump out of this hole and continue where you started. You can do bunch of `Shift-F11`s to jump out of the function(s), but you can do better. Right click on a frame in _Call Stack_ window and voilà, the _Run to Cursor_ (same `Ctrl-F10` shortcut) is there. Although same result can be achieve using different steps too, this one is very smooth.

![Run To Cursor in Call Stack window]({% include post_ilink, post: page, name: "run_to_cursor_call_stack.png" %})

Another tool into my, and your, toolbelt to be efficient while debugging.