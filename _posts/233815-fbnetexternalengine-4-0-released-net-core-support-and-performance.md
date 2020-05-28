---
title: |-
  FbNetExternalEngine 4.0 released - .NET Core support and performance
date: 2020-03-24T11:16:00Z
tags:
  - Firebird
  - .NET
---
[_FbNetExternalEngine_][1] version 4.0 is finally here. This version contains one significant feature and that's migration to .NET Core.

<!-- excerpt -->

Let's start with the .NET Core migration. Your code now runs on top of .NET Core 3.1 (3.1.2 at the moment) and the .NET Core runtime is included with the plugin so you don't have to install it on the machine separately. That means all the new .NET Core goodies are available. That also means you have to make sure your assemblies (and dependencies) can be loaded by .NET Core runtime. I recommend using .NET Standard 2.0 (or 2.1). Last but not least, theoretically this gives me the ability to offer Linux version of the plugin.

Stability improvement has been done around `IExecutionContext`.

And finally the performance. As with every release, performance improved. About 15% across the execution spectrum.

Documentation (requirements, installation steps, ...), examples and performance numbers are available on [this page][1].

Thanks to [SMS-Timing][2] for sponsoring most of the work and providing infrastructure for load testing.

[1]: /tools/fb-net-external-engine
[2]: http://www.sms-timing.com/