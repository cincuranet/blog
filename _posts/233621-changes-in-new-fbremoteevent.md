---
title: |-
  Changes in new FbRemoteEvent
date: 2017-05-07T06:57:00Z
tags:
  - .NET
  - C#
  - Firebird
  - SQL
---
The implementation of events via the `FbRemoteEvent` class was nor wrong nor correct. It was correct in a way that it did what it should do, but it was not clean and it was not guiding the developer into the _pit of success_, you had to know how it works under the covers to work with it properly. I decided to rewrite the implementation, fix some issues and more importantly give it more high-level feel, where you're actually using some infrastructure, instead of just close the raw implementation.

<!-- excerpt -->

The `FbRemoteEvent` now takes a connection string, instead of the `FbConnection`. Originally it took the connection, but the problem was that you couldn't (or rather shouldn't). And you still had to manage that connection somehow. Right now, the `FbRemoteEvent` takes just a plain connection string and manages the connection itself.

That's also why it's now `IDisposable` to allow you to clean up the resources (all connections) deterministically.

The original limit of 15 events is also removed. In fact, it's not clear where it came from, but for sure it's no more. Now the limit is based only on buffer the server has for events. The maximum length of event name is 255 characters and maximum buffer size with all events should not go over 64k. There's some bytes used internally, so the provider does the computation for you and if you go over it will give you an exception. Although it might be tempting to fill the buffer to the brim, you should know that when the event(s) fires, the whole buffer is sent over the wire. Consider that when thinking about the performance.

One new event - `RemoteEventError` -  was added, to give you callback when something goes wrong with events. As usual it gives you the exception only when it happens, it's not checking anything (hence it will not detect i.e. broken connection on the router along the way until it will do something on the connection).

Also, the `RemoteEventCounts` behaves slightly differently. Now it fires per event and only if the event has `Counts` greater than `0` (else it wasn't really fired).

And finally, only `QueueEvents` and `CancelEvents` methods are there. The `CancelEvents` stops getting the events from server (but the connection is still kept open). The `QueueEvents` registers events passed as parameter and starts listening.

Internally important optimization happened as I removed the extra thread being created and blocked waiting for events for come wasting resources. Now it's fully asynchronous. No thread is ever explicitly created. No resources wasted. Although most people will probably never see this difference.

Elementary example:

```csharp
using (var @event = new FbRemoteEvent(Connection.ConnectionString))
{
	@event.RemoteEventError += (sender, e) =>
	{
		Console.WriteLine($"ERROR: {e.Error}");
	};
	@event.RemoteEventCounts += (sender, e) =>
	{
		Console.WriteLine($"{e.Name}: {e.Counts}");
	};
	@event.QueueEvents("test");
	using (var cmd = Connection.CreateCommand())
	{
		cmd.CommandText = "execute block as begin post_event 'test'; end";
		cmd.ExecuteNonQuery();
	}
	Console.ReadKey();
}
```

You can see more uses in [`FbRemoteEventTests.cs`][1].

I hope you'll enjoy the new `FbRemoteEvent` [in 5.9.0.0][2].

[1]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/blob/master/Provider/src/FirebirdSql.Data.UnitTests/FbRemoteEventTests.cs
[2]: {{ include "post_link" 233620 }}