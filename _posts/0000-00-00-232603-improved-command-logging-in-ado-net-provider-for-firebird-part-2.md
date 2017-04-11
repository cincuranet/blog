---
title: |-
  Improved command logging in ADO.NET provider for Firebird - part 2
date: 2011-12-19T09:29:43Z
tags:
  - .NET
  - Firebird
  - Logging &amp; Tracing
layout: post
---
[Previous version][1] of [ADO.NET provider for Firebird][2] brought us a support for command tracing. Although it was good, it could be done better. Few interesting scenarios came back to as a valuable feedback and with the old implementation it was hard to do it.

The new one builds on top of [`TraceSource` class][3] allowing you to handle different sources from trace messages easily and independently. The _what's_ logged is same, but now every message is traced through `FirebirdSql.Data.FirebirdClient` source, hence you can easily i.e. turn it of (and just these messages, without affecting other messages) or send it to i.e. console window. Just a few lines in `app.config` and you're done.

```xml
<system.diagnostics>
	<sources>
		<source name="FirebirdSql.Data.FirebirdClient">
			<listeners>
				<clear />
				<add name="console" type="System.Diagnostics.ConsoleTraceListener"/>
			</listeners>
		</source>
	</sources>
</system.diagnostics>
```

The code above sends all messages (commands) from provider to (only) console window. You can use your own listener, of course or turn it off completely, using just the `<clear />`.

[1]: {% post_url 0000-00-00-232387-improved-command-logging-in-ado-net-provider-for-firebird %}/
[2]: http://www.firebirdsql.org/en/net-provider/
[3]: http://msdn.microsoft.com/en-us/library/system.diagnostics.tracesource.aspx