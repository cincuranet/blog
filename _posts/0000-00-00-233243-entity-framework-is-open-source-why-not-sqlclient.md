---
title: |-
  Entity Framework is open source, why not SqlClient?
date: 2013-04-23T18:34:10Z
tags:
  - Databases in general
  - Entity Framework
  - Firebird
  - MS SQL Server
  - Open Source
layout: post
---
If you're watching at least a little what's going on in .NET world you noticed that Entity Framework is open source for couple months now. That's a good thing.

On the other had there are still some pieces of the complete stack that are not open source. The one that I'm missing most is [SqlClient][1]. I'm writing [provider for Firebird][2] and although the MSDN documentation contains a lot of content sometimes it's not obvious how things should behave. Then the `SqlClient`'s behavior is (at least by me) taken as de-facto standard. I think everybody expects behavior that adheres to it. Over the last few years I've spent maybe thousands of hours trying things with `SqlClient` and `ILDASM`-ing into internals. But it could be easier if you could just step into the code and see the behavior, variables, ... Also other people might look at the code and instead of just reporting bug posting also related info where to find the proper implementation or how it differs internally.

I wish to go back to this post in the foreseeable future and happily strike-though the complete text and just say that SqlClient is open source too.

[1]: http://msdn.microsoft.com/en-us/library/system.data.sqlclient.aspx
[2]: http://www.firebirdsql.org/en/net-provider/