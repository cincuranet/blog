---
title: |-
  FbNetExternalEngine 3.0 released - execution of SQL statements inside context and performance
date: 2019-10-03T09:32:00Z
tags:
  - Firebird
  - .NET
---
[_FbNetExternalEngine_][1] version 3.0 is another step towards more useful .NET execution environment inside Firebird. Version 3.0 contains two significant pieces. The first, new, is ability to execute SQL statements inside the same context (aka transaction) as the currently executing code. The other is performance; there's always room for performance improvements.

<!-- excerpt -->

The SQL statement execution works by adding last parameter of type `IExecutionContext` (from `FbNetExternalEngineIntegration.dll`) to the procedure or function and using `Execute` method. This method allows you to execute either statements returning result sets (i.e. selects) or statements not returning anything. The statement is executed inside the same context (aka transaction) as the currently executing code. More information and examples can be found in [documentation][1].

In performance area, by careful optimization using my knowledge of how .NET runtime works and avoiding some expensive calls in Firebird, I was able to squeeze about 16% speedup on function and about 12% speedup on procedures. I still have some ideas to try, that might turn out to shave additional time from the execution time. Also, I'm planning to compare not pure execution speed, but also code execution between PSQL and _FbNetExternalEngine_/.NET, because in real world some significant code is usually in the body. Stay tuned.

Documentation, examples and performance numbers are available on [this page][1].

Last but not least big thanks to [SMS-Timing][2] for sponsoring my work on the plugin.

[1]: /tools/fb-net-external-engine
[2]: http://www.sms-timing.com/