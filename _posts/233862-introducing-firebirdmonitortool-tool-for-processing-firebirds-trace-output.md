---
title: |-
  Introducing FirebirdMonitorTool - tool for processing Firebird's trace output
date: 2021-05-20T06:18:00Z
tags:
  - Firebird
  - .NET
  - .NET Core
  - Databases in general
---
Last few weeks, on and off, I was reviving, finishing and improving a library, or now a tool if you will, that allows processing of trace output from Firebird. The library started its life probably sometime around 2014, and after a minimal working piece was done, it was briefly, yet successfully, used. Then it was left rusting up until last few weeks. What can it do?

<!-- excerpt -->

As you might know the Firebird's trace output is a text output from Firebird about what's happening inside the engine. The idea about tracing is great. Sadly, the implementation _completely_ missed the target, because the output is text output _without any structure_. And although one can develop its own plugin for tracing, in real world most people will use the implementation that's in-the-box.

The [_FirebirdMonitorTool_ library][1] takes the output and tries to parse it into objects. If you're a developer and you need to automatically monitor and evaluate your Firebird server and applications, such code will give you a good head start. 

But I also went a little further and added what I call "profiler". It is in its early stages currently and I'm learning what information and the representation would be valuable. Hence also your ideas and feedback are appreciated. It allows you to get complete tree view of what happened in the database. The root of the tree is currently a connection. Here's few examples.

```text
Attachment 85501: E:\www\example.com\
├ Transaction 76918 Start: READ_COMMITTED (RO: True | RV: True | W: False)
│ ├ Statement 632829 Prepare (25 ms): select distinct version from sync_w_meta_all_version order by version asc
│ ├ Statement 632829 Start: select distinct version from sync_w_meta_all_version order by version asc
│ ├ Statement 632829 Finish (0 ms): select distinct version from sync_w_meta_all_version order by version asc
│ ├ Statement 632829 Close
│ ├ Statement 632829 Free
│ ├ Trigger 'DBCOMMITRANSACTION' Start
│ └ Trigger 'DBCOMMITRANSACTION' End (0 ms)
└ Transaction 76918 End (0 ms): COMMIT_TRANSACTION
```

```text
Attachment 85502: E:\www\example.com\
├ Transaction 76919 Start: READ_COMMITTED (RO: False | RV: True | W: False)
│ ├ Statement 632875 Prepare (33 ms): execute procedure sync_mark_last_sync(1, ?)
│ ├ Statement 632875 Start: execute procedure sync_mark_last_sync(1, ?)
│ │ ├ Procedure 'SYNC_MARK_LAST_SYNC' Start
│ │ │ ├ Trigger 'T_ND_ONLY_SYS_INIT' Start
│ │ │ ├ Trigger 'T_ND_ONLY_SYS_INIT' End (0 ms)
│ │ │ ├ Trigger 'T_ND_UPD' Start
│ │ │ │ ├ Procedure 'INT_VERSIONING_START' Start
│ │ │ │ │ ├ Function 'INTERNALS.VERSION_START' Start
│ │ │ │ │ │ ├ Function 'INTERNALS.CS_VERSION_START' Start
│ │ │ │ │ │ └ Function 'INTERNALS.CS_VERSION_START' End (0 ms)
│ │ │ │ │ ├ Function 'INTERNALS.VERSION_START' End (0 ms)
│ │ │ │ │ └ Set Context: CTX_VERSION
│ │ │ │ └ Procedure 'INT_VERSIONING_START' End (0 ms)
│ │ │ ├ Trigger 'T_ND_UPD' End (0 ms)
│ │ │ ├ Trigger 'T_ND_ONLY_SYS_INIT_UPD' Start
│ │ │ ├ Trigger 'T_ND_ONLY_SYS_INIT_UPD' End (0 ms)
│ │ │ ├ Trigger 'X_ND_UPD_DEF' Start
│ │ │ ├ Trigger 'X_ND_UPD_DEF' End (0 ms)
│ │ │ ├ Trigger 'W_ND_UPD' Start
│ │ │ ├ Trigger 'W_ND_UPD' End (0 ms)
│ │ │ ├ Trigger 'T_ND_REBUILD_SEARCH' Start
│ │ │ ├ Trigger 'T_ND_REBUILD_SEARCH' End (0 ms)
│ │ │ ├ Trigger 'X_ND_UPD' Start
│ │ │ └ Trigger 'X_ND_UPD' End (0 ms)
│ │ └ Procedure 'SYNC_MARK_LAST_SYNC' End (0 ms)
│ ├ Statement 632875 Finish (0 ms): execute procedure sync_mark_last_sync(1, ?)
│ ├ Statement 632875 Free
│ ├ Trigger 'DBCOMMITRANSACTION' Start
│ │ ├ Function 'INTERNALS.VERSION_STOP_SEED' Start
│ │ │ ├ Function 'INTERNALS.CS_VERSION_STOP_SEED' Start
│ │ │ └ Function 'INTERNALS.CS_VERSION_STOP_SEED' End (0 ms)
│ │ └ Function 'INTERNALS.VERSION_STOP_SEED' End (0 ms)
│ └ Trigger 'DBCOMMITRANSACTION' End (0 ms)
└ Transaction 76919 End (21 ms): COMMIT_TRANSACTION
```

If you'd like to know more, technical details, etc. check the [_FirebirdMonitorTool_ page][1]. Download links are also there.

[1]: /tools/firebird-monitor-tool