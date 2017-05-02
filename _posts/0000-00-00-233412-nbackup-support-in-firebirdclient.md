---
title: |-
  NBackup support in FirebirdClient
date: 2013-09-05T14:56:37Z
tags:
  - .NET
  - Firebird
layout: post
---
Today I had a little of spare time and I had in my head support for [NBackup via Services API][1] in [FirebirdClient][2] for a long time. Especially since [NBackup saved me on Azure Websites][3].I was guessing it should not take that long to implement it, if you're in a good mood. Surprisingly I was right with my estimate.

<!-- excerpt -->

So let me introduce to you two new classes you will be able to use in next version. It's `FbNBackup` and `FbNRestore` (I'm still validating the naming in my head). You have all the switches and option from command line available ("no database triggers", "direct IO", ...).

To create a level 0 backup you can just call:

```csharp
var nbak = new FbNBackup();
nbak.ConnectionString = "..."
nbak.Level = 0;
nbak.BackupFile = "database.fnbk0"
nbak.DirectIO = true;
nbak.Options = FbNBackupFlags.NoDatabaseTriggers;
nbak.Execute();
```

Changing to `nbak.Level = 1;` you'll create another level and so on.

Restoring is even simpler. You just need your chain of backups and call:

```csharp
var nrest = new FbNRestore();
nrest.ConnectionString = "..."
nrest.BackupFiles = new[] { "database.fnbk0", "database.fnbk1" };
nrest.DirectIO = true;
nrest.Execute();
```

It's pretty much same API as with regular `FbBackup` and `FbRestore`, just with incremental-ish backup flavor. What else you'd like to see in foreseeable future in FirebirdClient?

[1]: http://tracker.firebirdsql.org/browse/DNET-224
[2]: http://www.firebirdsql.org/en/net-provider/
[3]: {% include post_link id="233284" %}