---
title: "Running program from trigger, SP, ..."
date: 2008-05-27T04:00:00Z
tags:
  - Databases in general
  - Firebird
layout: post
---
<small>This article was originally created for [Databazovy Svet][1] (in Czech) and covers a little bit more about this topic. This shortened version is focused only on solutions for Firebird, without any other stuff.</small>

Sometimes I see question(s) in forums, groups, lists about ability to run program from trigger or better to say perform some action done by external program. Well you can create many of possible solutions, working best for your case. But I'll cover two "special" features available in Firebird that can help you with this.

First, very elegant, option is to use events sent to clients subscribed to these. Every good connecting layer supports events - at least I can say, that Delphi, .NET, PHP, C/C++ works. Event is an identifier sent to subscribed clients from database server using some negotiated channel (i.e. similar to channel for sending commands). On the database side we'll use `POST_EVENT <identifier>`, where identifier is any string (maximal length 78 characters). Application should subscribe for consuming event with same identifier. For example in .NET/C# the code will look like this:

```csharp
FbRemoteEvent revent = new FbRemoteEvent(connection);
revent.AddEvents(new string[] { "new_order" });
// Add callback to the Firebird events
revent.RemoteEventCounts += new FbRemoteEventEventHandler(EventCounts);
// Queue events
revent.QueueEvents();
static void EventCounts(object sender, FbRemoteEventEventArgs args)
{
    Console.WriteLine("Event {0} has {1} counts.", args.Name, args.Counts);
}
```

This solution is very neat and event are made for this kind of tasks. The handling application can run on another machine. Disadvantage is, that events are sent on commit. About rolled back transactions - if you're interested in - you'll not be notified. Same story with some payload, you cannot add to event some data. So if you need to send some data you have to use some kind of timestamps, flags etc.

The other solution is coming with, kind of, opposite (dis)advantages. The main idea is to use program modules (*.dll/*.so) compiled into User Defined Functions - UDFs. This module may contain any code, written in any language with `stdcall` calling convention support - C/C++, Delphi, FreePascal. Taking into account, that this code is running in server context and is blocking any subsequent execution, it's good to keep this code really simple - KISS = Keep It Simple Stupid. For our example is suitable to make the UDF only sending some signal to another application and this application will do the action(s). The advantage of this solution is, that you can hand over the data too. Function calling is done immediately. So it's obvious, that also data from transaction, that can be rolled back later will be processed.

Hey, that's all. :) No more tricky stuff, just these two simple solutions. My advice is to first use events and then try to hack UDFs. Events are much better for this.

[1]: http://www.dbsvet.cz/