---
title: |-
  Using FbNetExternalEngine with Firebird Embedded (in .NET)
date: 2021-09-02T05:23:00Z
tags:
  - Firebird
  - .NET
---
Firebird Embedded is a great edition of Firebird (you can read more about it [here][1]) and if you put [_FbNetExternalEngine_][2] into the mix, it becomes crazy powerful tool. But to put it into the mix, one needs to carefully follow few steps to succeed.

<!-- excerpt -->

These steps are required because the code is jumping between unmanaged and managed world few times - from the .NET application (managed code) the code enters Firebird (unmanaged code) and as Firebird executes functions and procedures it goes back to managed code (and can go back to unmanaged if you use `IExecutionContext` (and the loop can continue)).

First requirement is that your application has to use same runtime as _FbNetExternalEngine_. At the time of writing that's .NET Core 3.1. After .NET 6 is released, in couple of months, it is going to be .NET 6. The reason is that with the current architecture I can't load two runtimes into one application.

Second, and final, requirement is that you need to start your application without debugger attached. You can attach it later after _FbNetExternalEngine_ was loaded.

And that's it. These two requirements and you have working .NET/C# functions and procedures in a Firebird "server" running inside your application.

[1]: https://www.firebirdsql.org/pdfmanual/html/ufb-cs-embedded.html
[2]: https://www.fbnetexternalengine.com