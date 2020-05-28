---
title: |-
  How I fixed and improved connection pooling by not working on connection resiliency.
date: 2018-05-24T13:00:00Z
tags:
  - .NET
  - .NET Standard
  - ADO.NET
  - C#
  - Network
---
For a long time, I had a [ticket with "Connection resiliency" title][1] in the issue tracker. My idea was to provide a functionality to be able to recover from a broken connection. Why? Because when I reimplemented (and fixed) connection pool sometime around 4.x version I removed one questionable (to put it lightly) feature. That, and also because I introduced a small bug, surfaced a problem people had/have in the code.

<!-- excerpt -->

Originally when the connection was taken from pool the provider did test whether it can communicate with the server by basically sending "give me nothing" to server. Server either responded "here's nothing" or the whole operation failed and next connection was taken. This is wrong for two reasons.

First reason is that even if the check succeeded, the connection could have become broken immediately after. Thus, the code needed to have recovery scenario for this. But then the test itself is useless because the recovery code would handle it anyway.

The other reason is that the connection pool is there to speed up things. Roundtrip to database kills this benefit instantly.

This is also confirmed by the [documentation][2]:

> If a connection exists to a server that has disappeared, this connection can be drawn from the pool even if the connection pooler has not detected the severed connection and marked it as invalid. This is the case because the overhead of checking that the connection is still valid would eliminate the benefits of having a pooler by causing another round trip to the server to occur. When this occurs, the first attempt to use the connection will detect that the connection has been severed, and an exception is thrown.

The easiest recovery code would be to throw away the connection and retry the logical operation again with a fresh connection. Sadly, a lot of people didn't have such code in place and relied on a fact that when the connection was fine during "open" (me being sometimes no exception), it stayed that way until the operation was complete.

The bug, I mentioned above, was that when the broken connection was disposed, I've put it back to the pool. That means even if such code was in place, it was very likely spinning in place with the same broken connection. Either people had to clear the whole pool (which isn't as bad as it sounds, because usually the connection was broken because of i.e. server restart and hence every connection was broken) or not use pooling at all. Shit happens. I'm sorry.

And so, with the plan to fix this with epic solution I created the connection resiliency idea. Turns out it's not possible in general (at least I think). Let me give you a simple example. You fetch some ID (i.e. from a procedure) and then you want to fetch record with that ID. Obviously within the same transaction. If the connection is broken during the second fetch I can't "just" reopen the connection and redo the operation. It would be a new transaction. Hence the record might have different values or not be there at all. And that's just reading data. More interesting scenarios happen when you start considering data modifications. Put simply, redoing "physical" operation isn't enough, the _logical_ operation has to be retried. And that's not something the ADO.NET provider can (or even should) do. With that on table, I gave up on this and went fixing only the returning-to-the-pool-on-broken-connection issue.

Thus, in the upcoming version (version 6) of FirebirdClient the connection is still returned from pool in whatever state it is, but if the next operation with server results in an error, disposing such connection will not put it back to the pool. Hopefully that will put back calmness into your code again.

As a final note, there [might become times][3] when the pooling is implemented on ADO.NET level and providers "just" use it.

[1]: http://tracker.firebirdsql.org/browse/DNET-668
[2]: https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling
[3]: https://github.com/dotnet/corefx/issues/26714