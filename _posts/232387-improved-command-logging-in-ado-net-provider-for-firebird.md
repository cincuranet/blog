---
title: |-
  Improved command logging in ADO.NET provider for Firebird
date: 2011-05-19T18:34:30Z
tags:
  - .NET
  - Firebird
  - Logging &amp; Tracing
---
I recently improved the command logging in [ADO.NET provider for Firebird][1]. Let me start with little bit of history and then you'll see the motivation and current improvements.

Before I added simple `Debug.WriteLine` to the `FbCommand` class. This was mainly driven with need to easily see commands I was [generating for Entity Framework][2]. Then the [Visual Studio 2010][3] came with the [IntelliTrace][4] (only Ultimate version) and while working with MS SQL Server I was happy to see commands without any additional effort. I wanted the same for [Firebird][5] too. Sadly the IntelliTrace right now isn't publicly pluggable. I was still using the debugging code, but often when doing development on customer's applications using released version of provider I lost this ability. No debug outputs, no IntelliTrace.

Because I believe it's important to have easy way to see (and not only for Entity Framework's generated) the command, to spot performance problems early, I added simple logging facility. This logging is enabled for all builds (not only debug) and uses [Trace class][6] from [.NET Framework][7]. Everytime you `Prepare` (the `Prepare` method is called also automatically before execute if not called manually) command you'll see the command text and current parameter names and values (if any). If you're inside Visual Studio you see by default the output in `Output` window. You can also [configure it][8] to log i.e. to file, probably usable in staging and/or production.

Hope you find this useful as I do.

[1]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[2]: {{ include "post_link" 230290 }}
[3]: http://www.microsoft.com/visualstudio/en-us/products/2010-editions
[4]: http://msdn.microsoft.com/en-us/library/dd264915.aspx
[5]: http://www.firebirdsql.org
[6]: http://msdn.microsoft.com/en-us/library/system.diagnostics.trace.aspx
[7]: http://www.microsoft.com/net/
[8]: http://msdn.microsoft.com/en-us/library/ms733025.aspx