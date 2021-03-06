---
title: |-
  Trace API support in ADO.NET provider for Firebird (FbTrace)
date: 2010-12-14T21:02:29Z
tags:
  - .NET
  - Firebird
---
When I came from [Firebird Conference in Bremen][1] I was so excited about all the people being excited about [Trace and Audit API][2] :) I decided I'll implement this in .NET provider as soon as possible. And here it is.

Right now there's a new class (and few supporting it) on `FirebirdSql.Data.Services` namespace called `FbTrace`, that you can use to start trace session and see what's going on on server. I'll not describe the Trace API itself, you can find info in documentation, I'll rather focus on how you can use it from the provider.

Right now, as I have no sharp idea how the people will use it, I implemented it simply and later, if I find some common cases, I'll add some "shortcuts" to help with these scenarios.

If you have ever used any `FbService` derived class, you'll be able to use `FbTrace` in under a minute.

```csharp
FbTrace trace = new FbTrace();
trace.ConnectionString = "database=localhost:rrr.fdb;user=sysdba;password=masterkey";
trace.ServiceOutput += (object sender, ServiceOutputEventArgs e) =>
	{
		Console.WriteLine(e.Message);
	};
trace.DatabasesConfigurations.Add(
	new FbDatabaseTraceConfiguration()
		{
			DatabaseName = string.Empty,
			Enabled = true,
			Events = FbDatabaseTraceEvents.Connections | FbDatabaseTraceEvents.Transactions
		});
trace.Start("test");
```

The important stuff is in `FbDatabaseTraceConfiguration` class, where you specify what should be traced, exactly the same way as in `fbtrace.conf` (you can find this file in [Firebird][3]'s installation). Mainly the database name to match for trace (if you want only some), whether it's enabled (probably useful if you want to keep the configuration somewhere, but selectively turn it off and on). And finally the events you're interested in – `FbDatabaseTraceEvents` enum. In the example above I'm tracing only connections and transactions (not for example stored procedures prepares or executions). All this configuration is added into `DatabasesConfigurations` property. You can have for sure different configurations for different databases. For Services API tracing there's property, because it's only one "services instance" in Firebird server, called `ServiceConfiguration`. At the last line I'm starting the trace session named `test` using method `Start`.

And that's it. When something happens in the database the `ServiceOutput` event handler will be invoked and you'll get the trace message.

Of course, you can also call `Suspend`, `Stop`, `Resume` and `List` methods to do accordant actions in API.

This is the initial implementation and some methods may be added (I'm already thinking about a few). Hope you enjoy it. Feel free to play with it and comment here or in list.

[1]: {{ include "post_link" 232169 }}
[2]: http://www.firebirdsql.org/rlsnotesh/rlsnotes25.html#rnfb25-trace
[3]: http://www.firebirdsql.org