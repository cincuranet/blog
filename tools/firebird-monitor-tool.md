---
title: FirebirdMonitorTool
layout: page
---
### FirebirdMonitorTool

#### Introduction

_FirebirdMonitorTool_ is a .NET library that allows parsing trace output messages into objects and processing them into larger structures.

#### Versions supported

Firebird 2.5 (any edition) is supported. Firebird 3.0 (any edition) is supported.

The library targets .NET Standard 2.1 and .NET 6.0. _ConsoleProfiler_ is currently provided for Windows x64 and Linux x64.

#### Profiler

The _ConsoleProfiler_ is implementation of "profiler" from trace messages. It allows you to get complete tree view of what happened in the database with important information right there. The root of the tree is currently a connection.

You can use it in an online mode by using `live` verb. It connects to database, listens to all the events and gives you the output. Or in an "file replay" mode by using `file` verb and providing a _full_ trace file. Using the `help` gives you more information.

Few examples of output.

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

#### Monitor

The `Monitor` class allows you to take arbitrary pieces of strings (receiving them from server, for example) and when that creates a complete message, parse it and get the parsed object. The parsed object is provided via `OnCommand` event. The optional `OnError` event allows you to gracefully process exceptions, should any happen during parsing.

#### Parser

The `Parser` class (and related pieces) is an implementation for parsing _complete_ trace messages. It's a specific low-level object and you don't usually use it directly. 

#### Getting it

* [_ConsoleProfiler_ for Windows][2]
* [_ConsoleProfiler_ for Linux][3]

#### Code

[Available on GitHub.][1]

#### Keep it working

It took a lot of man-days to have the library in the current state. Although the work was sponsored by [SMS-Timing][4], we're not keeping the library for ourselves. We're providing it for free and we expect you to honestly decide how to contribute back. It might be just sending an email and saying thank you. Or providing a good bug report. Or using the "Donate" button below. Whatever works for you. Just keep it honest. 

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

[1]: https://github.com/cincuranet/FirebirdMonitorTool
[2]: https://github.com/cincuranet/FirebirdMonitorTool/releases/latest/download/FirebirdMonitorTool-win.zip
[3]: https://github.com/cincuranet/FirebirdMonitorTool/releases/latest/download/FirebirdMonitorTool-linux.zip
[4]: http://www.sms-timing.com/
