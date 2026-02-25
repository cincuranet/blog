---
title: |-
  View captured variables for lambdas and local functions
date: 2018-08-20T07:00:00Z
tags:
  - Visual Studio
---
I don't know how long this feature is in Visual Studio - maybe because I'm more keyboard-focused -, but I just noticed it and it's a complete game changer. I mean, now I can't imagine not having it. :)

<!-- excerpt -->

If you hover the mouse over a lambda or a local function the hint shows variables captured. This is _so_ useful, especially if you're in a performance sensitive code and you don't want to create (or minimize creating) closures.

![Captured variables in lambda]({{ include "post_ilink" page "captured_lambda.png" }})

![Captured variables in local function]({{ include "post_ilink" page "captured_localfunc.png" }})

This works in my Visual Studio 2017 15.8.0 (latest at the time of writing) and 15.7.something (don't remember exactly, because I updated that machine to 15.8.0 in the meantime).