---
title: |-
  Purple squiggle in Visual Studio
date: 2017-09-08T07:21:00Z
tags:
  - Visual Studio
---
I'm pretty sure you know what the red squiggle in Visual Studio means (correct, it's the error). Very likely you know green squiggle (correct, it's the warning). Maybe you know blue squiggle (correct, it's the message). But do you know what purple squiggle means? By the way the official name for squiggle in Visual Studio is _wavy underline_. 

<!-- excerpt -->

Back to the purple color. If you use _Edit and Continue_ while debugging and you make so called unauthorized - basically changing structure of code not only code itself - the purple squiggle appears. Because you're in debugging your _Error List_ window is probably not visible, but Visual Studio tells you what happened.

![Error in Error List]({% include post_ilink, post: page, name: "error.png" %})

If such purple squiggle is in your code path, you have to restart your debugging session.

Wanna see it with your own eyes? Here's a simple example.

![Purple squiggle in action]({% include post_ilink, post: page, name: "purple_squiggle.gif" %})