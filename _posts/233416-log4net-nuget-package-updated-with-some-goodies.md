---
title: |-
  log4net NuGet package updated with some goodies
date: 2013-09-19T06:19:00Z
tags:
  - Logging & Tracing
  - NuGet
---
> [Follow-up post.][1]

I just pushed new version (1.2.12) of [log4net NuGet package][2]. Except - as expected - updated binaries this package also adds bit better integration with NuGet and into project installation.

<!-- excerpt -->

Now it adds default configuration into your `app.config`/`web.config` and also decorates the assembly with `XmlConfigurator` attribute with more or less default values (in a separate file, so you can easily remove it).

Feedback is welcome.

[1]: {{ include "post_link" 233419 }}
[2]: http://www.nuget.org/packages/log4net