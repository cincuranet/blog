---
title: |-
  FbNetExternalEngine 4.5 released
date: 2020-04-23T12:07:00Z
tags:
  - Firebird
  - .NET
---
[_FbNetExternalEngine_][1] version 4.5 is released. This version contains improvements around _Management procedures_.

<!-- excerpt -->

The new `net$declarations` that allows you see how and what plugin sees in the assembly and eventually can simplify the declarations. Old `net$update` was replaced `net$clean` - it's the same feature, only now it's up to you to upload new version of the assembly (i.e. have a function for it) and `net$clean` just refreshes everything inside the plugin.

As usual check the [docs page][1] as well as the _examples_ directory.

[1]: https://www.fbnetexternalengine.com